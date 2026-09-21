import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export function add(a: any, b: any) {
  return a + b;
}

export function capitalize(s: any) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}
