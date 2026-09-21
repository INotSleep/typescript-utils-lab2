import assert from 'node:assert/strict';
import { test } from 'node:test';
import { add, capitalize, config, formatNumber, groupBy, Logger } from '../src/index';

test('add accepts numbers, including zero and negative values', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-2, 2), 0);
  assert.equal(add(0, 0), 0);
});

test('capitalize handles normal, empty and Ukrainian strings', () => {
  assert.equal(capitalize('hello'), 'Hello');
  assert.equal(capitalize(''), '');
  assert.equal(capitalize('привіт'), 'Привіт');
});

test('formatNumber respects explicit precision, zero and environment defaults', () => {
  assert.equal(formatNumber(123.456, { precision: 2 }), '123.46');
  assert.equal(formatNumber(123.456, { precision: 0 }), '123');
  assert.equal(formatNumber(1.23456), (1.23456).toFixed(config.APP_PRECISION));
  assert.equal(formatNumber(1234.5, { precision: 2, locale: 'de-DE' }), '1.234,50');
});

test('groupBy groups repeated keys and accepts empty arrays', () => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Alice' },
  ];
  const groups = groupBy(users, 'name');
  assert.deepEqual(groups.Alice, [users[0], users[2]]);
  assert.deepEqual(groups.Bob, [users[1]]);
  assert.deepEqual(Object.keys(groupBy(users.slice(0, 0), 'id')), []);
  assert.deepEqual(groupBy(users, 'id')['2'], [users[1]]);
});

test('groupBy accepts keys that match Object prototype properties', () => {
  const items = [{ key: '__proto__' }, { key: 'constructor' }, { key: '__proto__' }];
  const groups = groupBy(items, 'key');
  assert.deepEqual(groups['__proto__'], [items[0], items[2]]);
  assert.deepEqual(groups.constructor, [items[1]]);
});

for (const level of ['silent', 'info', 'debug'] as const) {
  test('Logger filters messages at level ' + level, (t) => {
    const log = t.mock.method(console, 'log', () => {});
    const logger = new Logger(level);
    logger.info('hello');
    logger.debug('details');
    const expected =
      level === 'silent'
        ? []
        : level === 'info'
          ? [['[INFO]', 'hello']]
          : [
              ['[INFO]', 'hello'],
              ['[DEBUG]', 'details'],
            ];
    assert.deepEqual(
      log.mock.calls.map((call) => call.arguments),
      expected,
    );
  });
}
