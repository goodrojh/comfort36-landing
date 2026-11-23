<?php
declare(strict_types=1);

const CHANNELS = ['hero' => 'Первый экран сайта', 'cart' => 'Корзина сайта', 'config' => 'Подбор комплекта'];
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D';
const RETENTION_SECONDS = 7 * 24 * 60 * 60;
const MAX_BODY = 22000;

function encode(mixed $data): string {
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
}

function reply(int $status, ?array $body = null): never {
    http_response_code($status);
    if ($body !== null) {
        echo encode($body);
    }
    exit;
}

function settings(string $discovery = ''): array {
    $path = getenv('COMFORT36_LEAD_CONFIG') ?: dirname(__DIR__, 3) . '/comfort36-private/config.php';
    if (!is_readable($path)) {
        throw new RuntimeException('Configuration missing');
    }
    $config = require $path;
    $hasVk = !empty($config['vk_token']) && preg_match('/^-?[1-9]\d*$/D', (string) ($config['vk_peer'] ?? ''));
    $hasMail = function_exists('mail') && filter_var($config['mail_to'] ?? '', FILTER_VALIDATE_EMAIL)
        && filter_var($config['mail_from'] ?? '', FILTER_VALIDATE_EMAIL);
    $telegramToken = preg_match('/^[1-9]\d*:[A-Za-z0-9_-]{20,}$/D', $config['telegram_token'] ?? '') === 1;
    $hasTelegram = $telegramToken && preg_match('/^-?[1-9]\d*$/D', (string) ($config['telegram_chat'] ?? ''));
    $report = $config['sheets_url'] ?? '';
    if ($report && (!preg_match('~^https://script\.google\.com/(?:a/macros/[a-zA-Z0-9.-]+/|macros/)s/[A-Za-z0-9_-]+/exec$~D', $report)
        || strlen($config['sheets_key'] ?? '') < 32)) {
        throw new RuntimeException('Report settings incomplete');
    }
    $fullReport = $report && ($config['sheets_include_contacts'] ?? false) === true;
    $fullTelegram = $hasTelegram && ($config['telegram_include_contacts'] ?? false) === true;
    $canDiscover = ($discovery === 'vk' && !empty($config['vk_token'])) || ($discovery === 'telegram' && $telegramToken);
    if (empty($config['origins']) || !is_array($config['origins'])
        || strlen($config['rate_key'] ?? '') < 32 || (!$hasVk && !$hasMail && !$fullReport && !$fullTelegram && !$canDiscover)
        || !extension_loaded('pdo_sqlite') || !extension_loaded('curl')) {
        throw new RuntimeException('Lead settings incomplete');
    }

    $dbDir = realpath($config['data_dir'] ?? dirname($path));
    $public = realpath(dirname(__DIR__));
    if (!$dbDir || !$public || $dbDir === $public || str_starts_with($dbDir, $public . DIRECTORY_SEPARATOR)
        || !is_writable($dbDir)) {
        throw new RuntimeException('Use a private writable folder');
    }

    $config['data_dir'] = $dbDir;
    $config['has_vk'] = (bool) $hasVk;
    $config['has_mail'] = (bool) $hasMail;
    $config['has_telegram'] = (bool) $hasTelegram;
    return $config;
}

function database(string $dir): PDO {
    $db = new PDO('sqlite:' . $dir . '/leads.sqlite', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $db->exec('PRAGMA busy_timeout=3000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA secure_delete=ON;');
    $db->exec('CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, source TEXT NOT NULL,
        correction TEXT, accepted_at INTEGER NOT NULL, received TEXT, consent_version TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS deliveries (
        lead_id TEXT NOT NULL, channel TEXT NOT NULL, payload TEXT NOT NULL,
        due INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (lead_id, channel)
    );
    CREATE INDEX IF NOT EXISTS deliveries_due ON deliveries(due);
    CREATE TABLE IF NOT EXISTS rates (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);');
    return $db;
}

function validId(mixed $id): bool {
    return is_string($id) && preg_match(UUID, $id) === 1;
}

function clean(array $data): ?array {
    $id = $data['id'] ?? null;
    $source = $data['source'] ?? null;
    $correction = $data['correctionOf'] ?? null;
    $name = $data['name'] ?? null;
    $phone = $data['phone'] ?? null;
    $description = $data['description'] ?? null;
    $order = $data['order'] ?? '';
    if (!validId($id) || !is_string($source) || !isset(CHANNELS[$source])
        || ($correction !== null && (!validId($correction) || $correction === $id))
        || ($data['consent'] ?? null) !== true
        || !is_string($name) || trim($name) === '' || !preg_match('/^.{1,80}$/usD', $name)
        || !is_string($phone) || strlen($phone) > 25 || !preg_match('/^\+?[\d ()-]+$/D', trim($phone))
        || !preg_match('/^\d{10,15}$/D', preg_replace('/\D/', '', $phone))
        || !is_string($description) || !preg_match('/^.{0,500}$/usD', $description)
        || !is_string($order) || !preg_match('/^.{0,2600}$/usD', $order)) {
        return null;
    }
    return [
        'id' => $id, 'source' => $source, 'correction' => $correction,
        'name' => preg_replace('/[\r\n]+/', ' ', trim($name)), 'phone' => trim($phone),
        'description' => trim($description), 'order' => $correction ? '' : trim($order),
    ];
}

function message(array $lead, array $utm, bool $withContacts = true): string {
    $isCorrection = $lead['correction'] !== null;
    $number = strtoupper(substr($lead['correction'] ?? $lead['id'], 0, 8));
    $headline = [
        ($isCorrection ? 'Исправление к заявке COMFORT 36 № ' : 'Новая заявка с сайта COMFORT 36 № ') . $number,
        CHANNELS[$lead['source']],
    ];
    if (!$withContacts) {
        return implode("\n", [...$headline, 'Подробности в рабочем канале приёма заявок.']);
    }

    $tags = [];
    foreach ($utm as $key => $value) {
        $tags[] = $key . '=' . $value;
    }
    return implode("\n", array_filter([
        ...$headline,
        $lead['order'],
        'Имя: ' . $lead['name'],
        'Телефон: ' . $lead['phone'],
        $lead['description'] === '' ? '' : 'Комментарий: ' . $lead['description'],
        !$isCorrection && $tags ? 'UTM: ' . implode(' · ', $tags) : '',
        $isCorrection ? '' : 'Согласие на обработку данных получено на сайте.',
    ], fn (string $line) => $line !== ''));
}

function attribution(mixed $raw, array $list): array {
    $utm = [];
    foreach (UTM as $field) {
        $value = $raw[$field] ?? null;
        if (is_string($value) && in_array($value, $list[$field] ?? [], true)
            && preg_match('/^[\p{L}\p{N}_. -]{1,80}$/uD', $value) && !preg_match('/\d{8}/', $value)) {
            $utm[$field] = $value;
        }
    }
    return $utm;
}

function addLead(PDO $db, array $config, array $lead, mixed $rawUtm, string $ip): int {
    $id = $lead['id'];
    $now = time();
    $utm = attribution($rawUtm, $config['utm_allowlist'] ?? []);
    $fingerprint = hash_hmac('sha256', encode($lead + ['utm' => $utm]), $config['rate_key']);
    $db->exec('BEGIN IMMEDIATE');
    $committed = false;
    try {
        $lookup = $db->prepare('SELECT fingerprint, source, correction, accepted_at FROM leads WHERE id = ?');
        $lookup->execute([$id]);
        $previous = $lookup->fetch();
        if ($previous) {
            return hash_equals($previous['fingerprint'], $fingerprint) ? 202 : 409;
        }

        if ($lead['correction']) {
            $lookup->execute([$lead['correction']]);
            $original = $lookup->fetch();
            if (!$original || $original['correction'] || $original['source'] !== $lead['source']
                || $original['accepted_at'] <= $now - RETENTION_SECONDS) {
                return 410;
            }
        }

        $rateId = hash_hmac('sha256', $ip . ':' . intdiv($now, 600), $config['rate_key']);
        $rate = $db->prepare('INSERT INTO rates VALUES (?, 1, ?)
            ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count');
        $rate->execute([$rateId, $now + 600]);
        $count = (int) $rate->fetchColumn();
        $rate->closeCursor();
        if ($count > 12) {
            $db->exec('COMMIT');
            $committed = true;
            return 429;
        }

        $record = [
            'id' => $id, 'date' => (new DateTimeImmutable('@' . $now))->setTimezone(new DateTimeZone('Europe/Moscow'))->format('Y-m-d'),
            'channel' => CHANNELS[$lead['source']], 'utm' => $utm,
        ];
        $details = ['name' => $lead['name'], 'phone' => $lead['phone'], 'description' => $lead['description'], 'order' => $lead['order']];
        $insert = $db->prepare('INSERT INTO leads VALUES (?, ?, ?, ?, ?, ?, ?)');
        $insert->execute([$id, $fingerprint, $lead['source'], $lead['correction'], $now,
            encode($record + ['lead' => $details]), 'comfort36-site-2026-11-23']);

        $delivery = $db->prepare('INSERT INTO deliveries (lead_id, channel, payload, due) VALUES (?, ?, ?, ?)');
        foreach (['vk', 'mail', 'telegram'] as $channel) {
            if ($config['has_' . $channel]) {
                $full = $channel !== 'telegram' || ($config['telegram_include_contacts'] ?? false) === true;
                $payload = $channel === 'telegram' ? encode(['text' => message($lead, $utm, $full), 'full' => $full]) : message($lead, $utm);
                $delivery->execute([$id, $channel, $payload, $now]);
            }
        }

        $fullReport = ($config['sheets_include_contacts'] ?? false) === true;
        if (!empty($config['sheets_url']) && ($fullReport || !$lead['correction'])) {
            if ($fullReport) {
                $record['lead'] = $details;
                $record['correctionOf'] = $lead['correction'];
            }
            $delivery->execute([$id, 'report', encode($record), $now]);
        }

        $db->exec('COMMIT');
        $committed = true;
        return 202;
    } finally {
        if (!$committed) {
            $db->exec('ROLLBACK');
        }
    }
}

function post(string $url, string $body, array $headers = [], bool $follow = false): array {
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 4, CURLOPT_TIMEOUT => 8,
        CURLOPT_FOLLOWLOCATION => $follow, CURLOPT_MAXREDIRS => 2,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS,
    ]);
    try {
        $response = curl_exec($curl);
        return [curl_getinfo($curl, CURLINFO_HTTP_CODE), is_string($response) ? json_decode($response, true) : null];
    } finally {
        curl_close($curl);
    }
}

function telegram(array $config, string $method, array $payload): array {
    [$status, $result] = post('https://api.telegram.org/bot' . $config['telegram_token'] . '/' . $method,
        encode($payload), ['Content-Type: application/json']);
    if ($status !== 200 || ($result['ok'] ?? false) !== true) {
        throw new RuntimeException('Telegram rejected', (int) ($result['error_code'] ?? $status));
    }
    return $result['result'];
}

function deliver(array $config, array $row): void {
    switch ($row['channel']) {
        case 'vk':
            $random = unpack('Nid', hash('sha256', $row['lead_id'], true))['id'] % 2147483646 + 1;
            [$status, $result] = post('https://api.vk.com/method/messages.send', http_build_query([
                'v' => '5.199', 'access_token' => $config['vk_token'], 'peer_id' => $config['vk_peer'],
                'random_id' => $random, 'message' => $row['payload'], 'dont_parse_links' => 1, 'disable_mentions' => 1,
            ]));
            if ($status === 200 && is_int($result['response'] ?? null)) {
                return;
            }
            throw new RuntimeException('VK rejected', (int) ($result['error']['error_code'] ?? 0));
        case 'mail':
            $number = strtoupper(substr($row['lead_id'], 0, 8));
            $subject = '=?UTF-8?B?' . base64_encode("COMFORT 36 · заявка " . $number) . '?=';
            if (mail($config['mail_to'], $subject, $row['payload'], [
                'From' => $config['mail_from'], 'Content-Type' => 'text/plain; charset=UTF-8',
                'Content-Transfer-Encoding' => '8bit',
            ])) {
                return;
            }
            throw new RuntimeException('Mail rejected');
        case 'telegram':
            $payload = json_decode($row['payload'], true, flags: JSON_THROW_ON_ERROR);
            if ($payload['full'] && ($config['telegram_include_contacts'] ?? false) !== true) {
                throw new RuntimeException('Contact notification disabled');
            }
            telegram($config, 'sendMessage', [
                'chat_id' => $config['telegram_chat'], 'text' => $payload['text'],
                'link_preview_options' => ['is_disabled' => true], 'protect_content' => true,
            ]);
            return;
        case 'report':
            $report = json_decode($row['payload'], true, flags: JSON_THROW_ON_ERROR);
            if (isset($report['lead']) && ($config['sheets_include_contacts'] ?? false) !== true) {
                throw new RuntimeException('Contact reporting disabled');
            }
            [$status, $result] = post($config['sheets_url'], encode($report + ['key' => $config['sheets_key']]),
                ['Content-Type: application/json'], true);
            if ($status === 200 && ($result['ok'] ?? false) === true) {
                return;
            }
            throw new RuntimeException('Report rejected');
    }
    throw new RuntimeException('Invalid delivery channel');
}

function worker(PDO $db, array $config, ?callable $send = null): void {
    $send ??= 'deliver';
    $lock = fopen($config['data_dir'] . '/worker.lock', 'c');
    if ($lock === false) {
        throw new RuntimeException('Worker lock unavailable');
    }
    try {
        if (!flock($lock, LOCK_EX | LOCK_NB)) {
            return;
        }
        $now = time();
        $expired = $now - RETENTION_SECONDS;
        $db->prepare('DELETE FROM deliveries WHERE lead_id IN (SELECT id FROM leads WHERE accepted_at <= ?)')->execute([$expired]);
        $db->prepare('DELETE FROM leads WHERE accepted_at <= ?')->execute([$expired]);
        $db->prepare('DELETE FROM rates WHERE expires <= ?')->execute([$now]);
        $due = $db->prepare('SELECT d.* FROM deliveries d JOIN leads l ON l.id = d.lead_id
            WHERE d.due <= ? AND NOT EXISTS (
                SELECT 1 FROM deliveries pending JOIN leads earlier ON earlier.id = pending.lead_id
                WHERE pending.channel = d.channel AND l.correction IS NOT NULL
                AND (earlier.id = l.correction OR (earlier.correction = l.correction AND earlier.rowid < l.rowid))
            ) ORDER BY d.due, l.rowid LIMIT 15');
        $due->execute([$now]);
        $rows = $due->fetchAll();
        $due->closeCursor();
        foreach ($rows as $row) {
            try {
                $send($config, $row);
                $db->prepare('DELETE FROM deliveries WHERE lead_id = ? AND channel = ?')
                    ->execute([$row['lead_id'], $row['channel']]);
            } catch (Throwable $error) {
                $attempt = $row['attempts'] + 1;
                $delay = min(3600, 60 * (2 ** min($attempt - 1, 6)));
                $db->prepare('UPDATE deliveries SET attempts = ?, due = ? WHERE lead_id = ? AND channel = ?')
                    ->execute([$attempt, time() + $delay, $row['lead_id'], $row['channel']]);
                error_log(sprintf('[comfort36] %s delivery failed, attempt %d, code %d', $row['channel'], $attempt, $error->getCode()));
            }
        }
    } finally {
        fclose($lock);
    }
}

if (defined('COMFORT36_LEAD_LIBRARY')) {
    return;
}

umask(0077);
ini_set('display_errors', '0');
if (PHP_SAPI === 'cli') {
    try {
        switch ($argv[1] ?? '') {
            case 'worker':
                $config = settings();
                worker(database($config['data_dir']), $config);
                break;
            case 'vk-dialogs':
                $config = settings('vk');
                [$status, $result] = post('https://api.vk.com/method/messages.getConversations', http_build_query([
                    'v' => '5.199', 'access_token' => $config['vk_token'], 'count' => 40,
                ]));
                if ($status !== 200 || !isset($result['response']['items'])) {
                    throw new RuntimeException('VK conversation lookup failed', (int) ($result['error']['error_code'] ?? 0));
                }
                foreach ($result['response']['items'] as $item) {
                    $conversation = $item['conversation'];
                    $title = $conversation['chat_settings']['title'] ?? $conversation['peer']['type'];
                    printf("%d\t%s\n", $conversation['peer']['id'], preg_replace('/[\r\n]+/', ' ', $title));
                }
                break;
            case 'telegram-chats':
                $config = settings('telegram');
                $updates = telegram($config, 'getUpdates', ['limit' => 100, 'allowed_updates' => ['message', 'channel_post']]);
                $chats = [];
                foreach ($updates as $update) {
                    $chat = $update['message']['chat'] ?? $update['channel_post']['chat'] ?? null;
                    if ($chat) {
                        $chats[$chat['id']] = $chat['title'] ?? $chat['username'] ?? $chat['type'];
                    }
                }
                foreach ($chats as $id => $title) {
                    printf("%d\t%s\n", $id, preg_replace('/[\r\n]+/', ' ', $title));
                }
                break;
            default:
                exit(2);
        }
    } catch (Throwable $error) {
        error_log(sprintf('[comfort36] command failed, code %d', $error->getCode()));
        exit(1);
    }
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');
try {
    $config = settings();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!in_array($origin, $config['origins'], true)) {
        reply(403);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        reply(204);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        reply(405);
    }
    if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') {
        reply(415);
    }
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY) {
        reply(413);
    }
    $body = file_get_contents('php://input', length: MAX_BODY + 1);
    if (!is_string($body) || strlen($body) > MAX_BODY) {
        reply(413);
    }
    $data = json_decode($body, true);
    $lead = is_array($data) ? clean($data) : null;
    if (!$lead) {
        reply(422);
    }

    $status = addLead(database($config['data_dir']), $config, $lead, $data['attribution'] ?? [], $_SERVER['REMOTE_ADDR'] ?? '');
    reply($status, $status === 202 ? ['id' => $lead['id']] : null);
} catch (Throwable) {
    error_log('[comfort36] intake unavailable');
    reply(503);
}
