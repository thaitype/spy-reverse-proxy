import { server } from './server';
import { extractErorMessage } from './utils';

server().catch(extractErorMessage);
