import { add, capitalize, formatNumber, groupBy, type User } from './index';

console.log('add:', add(2, 3));
console.log('capitalize:', capitalize('hello'));
console.log('formatNumber:', formatNumber(123.456, { precision: 2 }));

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Alice' },
];
console.log('groupBy:', groupBy(users, 'name'));
