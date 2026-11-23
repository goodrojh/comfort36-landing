import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const dist = join(root, 'dist')
const scratch = mkdtempSync(join(tmpdir(), 'comfort36-deploy-'))
const index = join(scratch, 'index')
const git = (args, opts = {}) => execFileSync('git', args, {
  cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...opts,
}).trim()

try {
  git(['fetch', 'origin', 'refs/heads/gh-pages'])
  const previous = git(['rev-parse', 'FETCH_HEAD'])
  if (!process.env.npm_execpath) throw new Error('Run with npm run deploy')
  execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
    cwd: root, stdio: 'inherit', env: { ...process.env, BASE_PATH: '/comfort36-landing/' },
  })
  writeFileSync(join(dist, '.nojekyll'), '')
  const gitDir = git(['rev-parse', '--absolute-git-dir'])
  const indexEnv = { ...process.env, GIT_INDEX_FILE: index }
  git(['-C', dist, `--git-dir=${gitDir}`, `--work-tree=${dist}`, 'add', '--all', '--force', '.'], { env: indexEnv })
  const tree = git(['write-tree'], { env: indexEnv })
  const revision = git(['commit-tree', tree, '-p', previous, '-m', 'deploy: обновление COMFORT 36'])
  git(['push', 'origin', `${revision}:refs/heads/gh-pages`])
  console.log('https://goodrojh.github.io/comfort36-landing/')
} finally {
  rmSync(index, { force: true })
  rmSync(index + '.lock', { force: true })
  rmdirSync(scratch)
}
