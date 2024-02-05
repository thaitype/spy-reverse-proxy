import express from 'express';
import { spyMiddleware } from './spy-middleware';
import { extractErorMessage } from './utils';
import { env } from './env';

async function main() {
  const app = express();
  const port = env.srpPort;

  app.get(env.srpAdminRootPath, (req, res) => {
    res.send('Welcome to SRP Admin');
  });

  app.use(spyMiddleware);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
  });
}

main().catch(extractErorMessage);
