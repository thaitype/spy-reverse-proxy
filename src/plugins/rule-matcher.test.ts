import { describe, expect, test } from 'vitest';
import { isMatchedRule } from './rule-matcher';
import httpMocks from 'node-mocks-http';

const sharedRule = {
  data: 'data',
  plugin: 'plugin',
  ruleName: 'ruleName',
  upstreamUrl: 'upstreamUrl',
};

describe('Test only condtion changed ', () => {
  test('condition=false, Giving match path', () => {
    expect(
      isMatchedRule(
        {
          method: 'GET',
          path: '/path',
          condition: false,
          ...sharedRule,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(false);
  });

  test('condition=true, Giving match path', () => {
    expect(
      isMatchedRule(
        {
          method: 'GET',
          path: '/path',
          condition: true,
          ...sharedRule,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('condition=undefined, Giving match path', () => {
    expect(
      isMatchedRule(
        {
          method: 'GET',
          path: '/path',
          ...sharedRule,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(false);
  });
});

// describe('Test only method changed ', () => {

test('Giving match path', () => {
  expect(
    isMatchedRule(
      {
        ...sharedRule,
        method: 'GET',
        path: '/path',
        condition: true,
      },
      httpMocks.createRequest({
        method: 'GET',
        url: '/path',
      })
    )
  ).toBe(true);
});
