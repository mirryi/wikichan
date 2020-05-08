/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Cache {
  set(key: string, val: string, duration: number): Promise<void>;
  get(key: string): Promise<string | undefined>;
  list(): Promise<Record<string, string>>;
}