import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export function add(a: number, b: number): number {
  return a + b;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type NumberFormatOptions = { precision?: number; locale?: string };

export function formatNumber(value: number, options?: NumberFormatOptions): string {
  const precision = options?.precision ?? Number(process.env.APP_PRECISION ?? 2);
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
