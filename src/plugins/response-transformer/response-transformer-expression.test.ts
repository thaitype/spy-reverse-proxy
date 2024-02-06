import { describe, expect, test } from 'vitest';
import { ResponseTransformerExpression } from './response-transformer-expression';

describe('Should prepare', () => {
  test('without whitespace', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code=400');
    expect(exp.actionExpressions).toStrictEqual(['replace.status_code=400']);
  });

  test('with whitespace', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code = 400');
    expect(exp.actionExpressions).toStrictEqual(['replace.status_code = 400']);
  });

  test('with before and after whitespace', () => {
    const exp = new ResponseTransformerExpression({} as any, ' replace.status_code = 400 ');
    expect(exp.actionExpressions).toStrictEqual(['replace.status_code = 400']);
  });

  test('multiple expressions', () => {
    const exp = new ResponseTransformerExpression(
      {} as any,
      'replace.status_code=400,replace.body={"message":"error"}'
    );
    expect(exp.actionExpressions).toStrictEqual(['replace.status_code=400', 'replace.body={"message":"error"}']);
  });

  test('multiple expressions with whitespace', () => {
    const exp = new ResponseTransformerExpression(
      {} as any,
      'replace.status_code=400 , replace.body={"message":"error"}'
    );
    expect(exp.actionExpressions).toStrictEqual(['replace.status_code=400', 'replace.body={"message":"error"}']);
  });
});

describe('Should validate expression only', () => {
  test('with valid expression', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code=400');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({ success: true });
  });

  test('with invalid expression', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({ success: false, errorMessages: ['Invalid action expression: replace.status_code'] });
  });

  test('with multiple invalid expression', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code,replace.body');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({
      success: false,
      errorMessages: ['Invalid action expression: replace.status_code', 'Invalid action expression: replace.body'],
    });
  });

  test('with valid and invalid expression', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code=400,replace.body');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({
      success: false,
      errorMessages: ['Invalid action expression: replace.body'],
    });
  });

  test('with valid and invalid expression', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code=400,replace.body');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({
      success: false,
      errorMessages: ['Invalid action expression: replace.body'],
    });
  });
  test('with valid expression and whitespace', () => {
    const exp = new ResponseTransformerExpression({} as any, 'replace.status_code = 400');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({ success: true });
  });

  test('with valid expression and whitespace before & after', () => {
    const exp = new ResponseTransformerExpression({} as any, ' replace.status_code = 400 ');
    const result = exp.validateAndExecute({ withExecute: false, skipActionExpression: true });
    expect(result).toStrictEqual({ success: true });
  });
});
