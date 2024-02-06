import { server } from './server';
import { extractErorMessage } from './utils/utils';

server().catch(extractErorMessage);
