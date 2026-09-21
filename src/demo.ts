import { add, capitalize, formatNumber, groupBy, type User, Logger } from './index';
import { config } from './config';

console.log('add:', add(2, 3));
console.log('capitalize:', capitalize('hello'));
console.log('formatNumber:', formatNumber(123.456, { precision: 2 }));

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Alice' },
];
console.log('groupBy:', groupBy(users, 'name'));

const logger = new Logger(config.LOG_LEVEL);
logger.info('demo started');
logger.debug('precision: ' + config.APP_PRECISION);
console.log('from env:', formatNumber(123.456));
