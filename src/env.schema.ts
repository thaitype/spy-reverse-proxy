import { z } from 'zod';

export const environmentSchema = z.object({
  /**
   * the target URL that want the spy server to proxy to
   */
  SRP_UPSTREAM_URL: z.string(),
  /**
   * The connection string for Azure Table Storage
   * @example DefaultEndpointsProtocol=https;AccountName=ACCOUNT_NAME;AccountKey=ACCOUNT_KEY;TableEndpoint=TABLE_ENDPOINT;
   * @see https://learn.microsoft.com/en-us/azure/cosmos-db/table/how-to-use-nodejs
   *
   * Set this to enable the spy server to write/read from Azure Table Storage
   */
  SRP_DATA_AZURE_TABLE_CONNECTION_STRING: z.string().optional(),
  /**
   * The port that the spy server will listen to
   */
  SRP_PORT: z.string().default('3333'),
  /**
   * if the value is `true` , ignore all spy config rules
   * @default false
   */
  SRP_DISABLE: z.preprocess(val => {
    if (val === '' || val === undefined) return false;
    if (typeof val !== 'string') return false;
    return val.toLowerCase() === 'true';
  }, z.boolean()),
  /**
   * the root path of admin of the reverse proxy, default is `/srp`
   * @default `/srp`
   */
  SRP_ADMIN_ROOT_PATH: z.string().default('/srp'),
});
