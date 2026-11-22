#!/usr/bin/env node
/**
 * 사용법: node scripts/run-edition.js <buyer|admin> <실행할 명령...>
 * 환경변수 KSHORTS_EDITION을 지정해 명령을 실행한다. (Windows/Linux 공통, cross-env 불필요)
 */
import { spawnSync } from 'child_process';

const [edition, ...cmd] = process.argv.slice(2);
if (!['buyer', 'admin'].includes(edition) || cmd.length === 0) {
  console.error('사용법: node scripts/run-edition.js <buyer|admin> <명령...>');
  process.exit(2);
}
const r = spawnSync(cmd.join(' '), { stdio: 'inherit', shell: true, env: { ...process.env, KSHORTS_EDITION: edition } });
process.exit(r.status ?? 1);
