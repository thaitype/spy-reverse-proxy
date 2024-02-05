import 'dotenv/config';
import { schema } from './env.schema';
import { extractErorMessage } from './utils';
/**
 * Get environment variables
 */
export function getEnv() {
  try {
    return schema.parse(process.env);
  } catch (error) {
    console.error('Environment variables are not set correctly');
    console.error(extractErorMessage(error));
    process.exit(1);
  }
}
