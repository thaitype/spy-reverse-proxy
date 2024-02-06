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

describe('Test only method changed ', () => {
  test('method=GET, Giving match path, match method', () => {
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

  test('method=POST, Giving match path, match method', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: 'POST',
          path: '/path',
          condition: true,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(false);
  });

  test('method=get, Giving match path, should match case in-sensitive method', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: 'get',
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

  test('method=GET with whitespace, Giving match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: 'GET ',
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
});

describe('Test only method is empty, should match all methods', () => {
  test('method=undefined, Giving match path, match all methods (GET)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
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

  test('method=undefined, Giving match path, match all methods (POST)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path',
          condition: true,
        },
        httpMocks.createRequest({
          method: 'POST',
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('method=null, Giving match path, match all methods (GET)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: null,
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

  test('method="" (empty string), Giving match path, match all methods (GET)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: '',
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

  test('method="*", Giving match path, match all methods (GET)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: '*',
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

  test('method="* " (with whitespace), Giving match path, match all methods (GET)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: '* ',
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

  test('method=" " (with whitespace), Giving match path, match all methods (GET)', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          method: ' ',
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
});

describe('Test only path changed ', () => {
  test('path=/path, Giving match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path',
          condition: true,
        },
        httpMocks.createRequest({
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('path=/path, Giving not match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path',
          condition: true,
        },
        httpMocks.createRequest({
          url: '/path2',
        })
      )
    ).toBe(false);
  });

  test('path="" (empty string), Giving not match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '',
          condition: true,
        },
        httpMocks.createRequest({
          url: '/path',
        })
      )
    ).toBe(false);
  });

  test('path=" " (empty string with whitespace), Giving not match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: ' ',
          condition: true,
        },
        httpMocks.createRequest({
          url: '/path',
        })
      )
    ).toBe(false);
  });

  test('path=undefined, Giving not match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          condition: true,
        },
        httpMocks.createRequest({
          url: '/path',
        })
      )
    ).toBe(false);
  });

  test('path=/path with whitespace, Giving match path', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path ',
          condition: true,
        },
        httpMocks.createRequest({
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('path=/path with whitespace, Giving match path and match method', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path ',
          method: 'GET',
          condition: true,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('path=path (without begining slash), Giving match path and match method', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: 'path',
          method: 'GET',
          condition: true,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('path=/path (without ending slash), Giving match path and match method', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path',
          method: 'GET',
          condition: true,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(true);
  });

  test('path=/path/ (with start and ending slash), Giving match path and match method', () => {
    expect(
      isMatchedRule(
        {
          ...sharedRule,
          path: '/path/',
          method: 'GET',
          condition: true,
        },
        httpMocks.createRequest({
          method: 'GET',
          url: '/path',
        })
      )
    ).toBe(true);
  });
});
