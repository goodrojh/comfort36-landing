<?php
// Place this file outside every public website root as comfort36-private/config.php.
return [
    'origins' => ['https://comfort-36.ru', 'https://www.comfort-36.ru', 'https://goodrojh.github.io'],
    'data_dir' => __DIR__,
    'rate_key' => '',
    'vk_token' => '',
    'vk_peer' => '',
    'telegram_token' => '',
    'telegram_chat' => '',
    'telegram_include_contacts' => false,
    'mail_to' => '',
    'mail_from' => '',
    'sheets_url' => '',
    'sheets_key' => '',
    'sheets_include_contacts' => false,
    'utm_allowlist' => [
        'utm_source' => ['vk', 'yandex'],
        'utm_medium' => ['cpc', 'social'],
        'utm_campaign' => [],
        'utm_content' => [],
        'utm_term' => [],
    ],
];
