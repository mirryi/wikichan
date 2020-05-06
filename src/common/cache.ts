/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Cache {
  // Succeeds with empty value if was able to set.
  // Rejects if val is of invalid type or fails for some other reason.
  set(key: string, val: any): Promise<void>;

  // Succeeds with an untyped value if value existed.
  // Succeeds with null if value not found.
  // Rejects if fails for some other reason.
  get(key: string): Promise<any>;
}
