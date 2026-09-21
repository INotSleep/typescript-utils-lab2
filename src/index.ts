import { config } from './config';

export { config } from './config';
export type { Config } from './config';

export function add(values: number[]): number {
  return values.reduce((acc, x) => acc + x, 0);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type NumberFormatOptions = { precision?: number; locale?: string };

export function formatNumber(value: number, options?: NumberFormatOptions): string {
  const precision = options?.precision ?? config.APP_PRECISION;
  if (options?.locale) {
    return value.toLocaleString(options.locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  }
  return value.toFixed(precision);
}

export interface User {
  id: number;
  name: string;
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  const groups: Record<string, T[]> = Object.create(null);
  for (const item of arr) {
    const value = String(item[key]);
    (groups[value] ??= []).push(item);
  }
  return groups;
}

export type LogLevel = 'silent' | 'info' | 'debug';

export class Logger {
  constructor(private level: LogLevel) {}

  info(msg: string): void {
    if (this.level !== 'silent') console.log('[INFO]', msg);
  }

  debug(msg: string): void {
    if (this.level === 'debug') console.log('[DEBUG]', msg);
  }
}
