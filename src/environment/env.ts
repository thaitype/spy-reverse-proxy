import 'dotenv/config';
import { environmentSchema } from '../environment/env.schema.js';
import { extractErorMessage } from '@/utils/index.js';
import { zodParser } from '@thaitype/record-parser/zod';
/**
 * Get environment variables
 */
export function getEnv() {
  try {
    return zodParser(environmentSchema, {
      caseConversion: 'upper',
    }).parse(process.env);
  } catch (error) {
    console.error('Environment variables are not set correctly');
    console.error(extractErorMessage(error));
    process.exit(1);
  }
}

export const env = getEnv();
