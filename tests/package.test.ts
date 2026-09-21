import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

const root = resolve('.');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const cjs = join(root, pkg.main);
const esm = pathToFileURL(join(root, pkg.module)).href;

function runConfig(values: NodeJS.ProcessEnv = {}, envFile?: string) {
  const cwd = mkdtempSync(join(tmpdir(), 'ts-utils-'));
  const env = { ...process.env };
  delete env.APP_PRECISION;
  delete env.LOG_LEVEL;
  Object.assign(env, values);
  try {
    if (envFile !== undefined) writeFileSync(join(cwd, '.env'), envFile);
    return spawnSync(
      process.execPath,
      [
        '-e',
        `const { config } = require(${JSON.stringify(cjs)}); console.log(JSON.stringify(config));`,
      ],
      { cwd, env, encoding: 'utf8' },
    );
  } finally {
    if (envFile !== undefined) unlinkSync(join(cwd, '.env'));
    rmdirSync(cwd);
  }
}

test('config uses defaults when .env is absent', () => {
  const result = runConfig();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { APP_PRECISION: 2, LOG_LEVEL: 'info' });
});

test('config reads .env, coerces precision and preserves environment overrides', () => {
  const result = runConfig({ LOG_LEVEL: 'silent' }, 'APP_PRECISION=3\nLOG_LEVEL=debug\n');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { APP_PRECISION: 3, LOG_LEVEL: 'silent' });
  for (const APP_PRECISION of ['0', '10']) {
    const boundary = runConfig({ APP_PRECISION });
    assert.equal(boundary.status, 0, boundary.stderr);
    assert.equal(JSON.parse(boundary.stdout).APP_PRECISION, Number(APP_PRECISION));
  }
});

test('config rejects invalid precision and log levels', () => {
  for (const APP_PRECISION of ['-1', '11', '2.5', 'abc']) {
    const result = runConfig({ APP_PRECISION });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ZodError/);
  }
  assert.notEqual(runConfig({ LOG_LEVEL: 'verbose' }).status, 0);
});

test('CJS and ESM entry points work and declaration files exist', () => {
  const scripts = [
    `const { add } = require(${JSON.stringify(cjs)}); console.log(add(2, 3));`,
    `import { add } from ${JSON.stringify(esm)}; console.log(add(2, 3));`,
  ];
  for (const [index, script] of scripts.entries()) {
    const result = spawnSync(
      process.execPath,
      [index === 0 ? '--input-type=commonjs' : '--input-type=module', '-e', script],
      { cwd: root, encoding: 'utf8' },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), '5');
  }
  assert.match(readFileSync(join(root, pkg.types), 'utf8'), /declare function add/);
});
