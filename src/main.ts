import express from 'express';
import { spyMiddleware } from './spy-middleware';
import { extractErorMessage } from './utils';

async function main() {
  const app = express();
  const port = process.env.PORT ?? 3333;

  app.use(spyMiddleware);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch(extractErorMessage);
