import { z } from 'zod';

const azureTableConfig = {
  /**
   * The connection string for Azure Table Storage
   * @example DefaultEndpointsProtocol=https;AccountName=ACCOUNT_NAME;AccountKey=ACCOUNT_KEY;TableEndpoint=TABLE_ENDPOINT;
   * @see https://learn.microsoft.com/en-us/azure/cosmos-db/table/how-to-use-nodejs
   *
   * Set this to enable the spy server to write/read from Azure Table Storage
   */
  SRP_DATA_AZURE_TABLE_CONNECTION_STRING: z.string().optional(),
  /**
   * The prefix of the Azure Table name
   * @default `SpyReverseProxy`
   */
  SRP_DATA_AZURE_TABLE_NAME_PREFIX: z.string().default('SpyReverseProxy'),
};

export const environmentSchema = z.object({
  /**
   * the target URL that want the spy server to proxy to
   */
  SRP_UPSTREAM_URL: z.string(),
  /**
   * Azure Table configuration
   */
  ...azureTableConfig,
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
  /**
   * Logger level
   *
   * Options: "fatal" | "error" | "warn" | "info" | "debug" | "trace"
   *
   * The package uses the [pino](https://github.com/pinojs/pino) package internally.
   */
  SRP_LOGGER_LEVEL: z.string().default('info'),
});
