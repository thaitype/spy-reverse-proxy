import 'dotenv/config';
import { environmentSchema } from '../environment/env.schema';
import { extractErorMessage } from '@/utils';
// import { zodParser } from '@thaitype/record-parser';
/**
 * Get environment variables
 */
export function getEnv() {
  try {
    const env = environmentSchema.parse(process.env);
    return {
      srpDataAzureTableConnectionString: env.SRP_DATA_AZURE_TABLE_CONNECTION_STRING,
      srpDataAzureTableNamePrefix: env.SRP_DATA_AZURE_TABLE_NAME_PREFIX,
      srpUpstreamUrl: env.SRP_UPSTREAM_URL,
      srpPort: env.SRP_PORT,
      srpDisable: env.SRP_DISABLE,
      srpAdminRootPath: env.SRP_ADMIN_ROOT_PATH,
      srpLoggerLevel: env.SRP_LOGGER_LEVEL,      
    };
  } catch (error) {
    console.error('Environment variables are not set correctly');
    console.error(extractErorMessage(error));
    process.exit(1);
  }
}

export const env = getEnv();
