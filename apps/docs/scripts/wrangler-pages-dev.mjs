// Nitro prerenders the Cloudflare Pages build by running its preview command and
// appending `--port <n> --host localhost`. `wrangler pages dev` has no `--host`
// flag, so this wrapper turns it into `--ip` and runs the local wrangler.
import { spawn } from 'node:child_process';

const args = process.argv.slice(2).map((arg) => (arg === '--host' ? '--ip' : arg));
const child = spawn('wrangler', ['pages', 'dev', ...args], { stdio: 'inherit', shell: process.platform === 'win32' });

// Nitro stops the preview with SIGTERM once prerendering ends. That is a clean stop.
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    stopping = true;
    child.kill(signal);
  });
}
child.on('exit', (code) => process.exit(stopping ? 0 : (code ?? 1)));
