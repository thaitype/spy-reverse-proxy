import { server } from './server';
import { extractErorMessage } from './utils/utils';

server().catch(error => {
  console.error(extractErorMessage(error));
  process.exit(1);
});
