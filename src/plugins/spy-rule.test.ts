import { describe, expect, test } from 'vitest';
import { SpyRule } from './spy-rule';

test('test empty rule', () => {
  const spyRule = new SpyRule([]);
  expect(spyRule.parse()).toStrictEqual({
    rules: {},
    errorMessages: []
  });

});


