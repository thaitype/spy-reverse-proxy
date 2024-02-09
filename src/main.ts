import { server } from './server.js';
import { extractErorMessage } from './utils/utils.js';

server().catch(error => {
  console.error(extractErorMessage(error));
  process.exit(1);
});
