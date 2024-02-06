import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const trimStartAndEndSlash = (path?: string) => path?.trim().replace(/^\/+|\/+$/g, '');

export function extractErorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return fromZodError(error).message;
  }

  if (error instanceof Error) {
    return `${error.message} ${error.stack}`;
  }

  return String(error);
}
