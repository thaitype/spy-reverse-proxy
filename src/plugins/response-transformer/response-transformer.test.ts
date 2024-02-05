import { expect, test } from 'vitest';
import { responseTransformerPlugin } from '.';

test('response-transformer', () => {
  expect(responseTransformerPlugin()).toStrictEqual({
    upstreamUrl: 'upstreamUrl',
    method: 'httpMethod',
    condition: true,
  });
});
