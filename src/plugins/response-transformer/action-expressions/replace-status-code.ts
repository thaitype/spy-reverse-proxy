import type { HandleResponseParams } from "@/plugins";
import type { ExpressionValidateResult } from "../response-transformer-expression";

export function replaceStatusCode(params: HandleResponseParams, actionParams: string): ExpressionValidateResult {
  const statusCode = parseInt(actionParams);
  if (isNaN(statusCode)) {
    return {
      success: false,
      errorMessages: [`Invalid status code: ${actionParams}`],
    };
  }
  params.res.statusCode = statusCode;
  return {
    success: true,
  };
}