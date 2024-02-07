import { describe, expect, test } from 'vitest';
import { SpyRule } from './spy-rule';
import { RuleConfig } from './rule.schema';

const sharedRule = {
  plugin: 'plugin',
  ruleName: 'ruleName',
  upstreamUrl: 'http://upstream.url',
};

describe('SpyRule', () => {
  test('test empty rule', () => {
    const spyRule = new SpyRule([]);
    expect(spyRule.parse()).toStrictEqual({
      rules: {},
      errorMessages: [],
    });
  });

  test('test rule with one spy', () => {
    const spyRule = new SpyRule([
      {
        ...sharedRule,
        path: '/foo',
        data: 'status_code=400',
      },
    ]);
    expect(spyRule.parse()).toStrictEqual({
      rules: {
        'plugin:foo': {
          ruleName: 'ruleName',
          path: '/foo',
          plugin: 'plugin',
          condition: undefined,
          method: undefined,
          actionExpressions: [{ action: 'status_code', param: '400' }],
        },
      },
      errorMessages: [],
    } satisfies RuleConfig);
  });

  test('when data is empty', () => {
    const spyRule = new SpyRule([
      {
        ...sharedRule,
        path: '/foo',
        data: '',
      },
    ]);
    expect(spyRule.parse()).toStrictEqual({
      rules: {
        'plugin:foo': {
          ruleName: 'ruleName',
          path: '/foo',
          plugin: 'plugin',
          condition: undefined,
          method: undefined,
          actionExpressions: [],
        },
      },
      errorMessages: ['Action name is missing in the expression: ""'],
    } satisfies RuleConfig);
  });

  test('when action is missing', () => {
    const spyRule = new SpyRule([
      {
        ...sharedRule,
        path: '/foo',
        data: '=400',
      },
    ]);
    expect(spyRule.parse()).toStrictEqual({
      rules: {
        'plugin:foo': {
          ruleName: 'ruleName',
          path: '/foo',
          plugin: 'plugin',
          condition: undefined,
          method: undefined,
          actionExpressions: [],
        },
      },
      errorMessages: ['Action name is missing in the expression: "=400"'],
    } satisfies RuleConfig);
  });

  test('when param is missing', () => {
    const spyRule = new SpyRule([
      {
        ...sharedRule,
        path: '/foo',
        data: 'status_code=',
      },
    ]);
    expect(spyRule.parse()).toStrictEqual({
      rules: {
        'plugin:foo': {
          ruleName: 'ruleName',
          path: '/foo',
          plugin: 'plugin',
          condition: undefined,
          method: undefined,
          actionExpressions: [],
        },
      },
      errorMessages: ['Param is missing in the expression: "status_code="'],
    } satisfies RuleConfig);
  });
});

describe('Make sure rule ID can group rule', () => {
  test('generate rule id shold trim path', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        path: '/foo',
        data: '',
      })
    ).toBe('plugin:foo');
  });

  test('generate rule id should accept subpath', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        path: '/foo/bar',
        data: '',
      })
    ).toBe('plugin:foo/bar');
  });

  test('generate rule id should use insensitve-case method', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        path: '/foo',
        method: 'GET',
        data: '',
      })
    ).toBe('plugin:foo:get');
  });

  test('generate rule id should include method and trim path', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        path: '/foo/',
        method: 'GET',
        data: '',
      })
    ).toBe('plugin:foo:get');
  });

  test('generate rule id should use insensitve-case plugin name', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        plugin: 'Plugin',
        path: '/foo/',
        method: 'GET',
        data: '',
      })
    ).toBe('plugin:foo:get');
  });

  test('generate rule id when plugin name is undefined', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        plugin: undefined,
        path: '/foo/',
        method: 'GET',
        data: '',
      })
    ).toBe('foo:get');
  });

  test('generate rule id when path is undefined', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        path: undefined,
        method: 'GET',
        data: '',
      })
    ).toBe('plugin:get');
  });

  test('generate rule id when method is undefined', () => {
    const spyRule = new SpyRule([]);
    expect(
      spyRule.generateRuleId({
        ...sharedRule,
        path: '/foo/',
        method: undefined,
        data: '',
      })
    ).toBe('plugin:foo');
  });
});
