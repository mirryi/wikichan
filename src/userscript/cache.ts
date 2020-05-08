import { Cache } from "@common/cache";

export class GMCache implements Cache {
  prefix: string;

  private static delimit = ":::::";

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, val: string, duration: number): Promise<void> {
    const k = `${this.prefix}_${key}`;

    const expires = new Date(Date.now() + 1000 * duration);
    const v = expires.getTime() + GMCache.delimit + val;

    return GM.setValue(k, v);
  }

  async get(key: string): Promise<string | undefined> {
    const k = `${this.prefix}_${key}`;
    return this.getRaw(k);
  }

  async list(): Promise<Record<string, string>> {
    const list = await GM.listValues();

    const tuples = (
      await Promise.all(
        list.map(
          async (k): Promise<[string, string] | undefined> => {
            const val = await this.getRaw(k);
            if (val === undefined) {
              return undefined;
            }

            const key = this.parseRawKey(k);
            if (!key) {
              await this.remove(k);
              return undefined;
            }

            return [key, val];
          },
        ),
      )
    ).filter((v) => v !== undefined) as [string, string][];

    const record: Record<string, string> = {};
    for (const [k, v] of tuples) {
      record[k] = v;
    }

    return record;
  }

  private async getRaw(fullKey: string): Promise<string | undefined> {
    const k = fullKey;
    const v = await GM.getValue(k);
    if (v === undefined) {
      await this.remove(k);
      return v;
    }

    const parts = (v as string).split(GMCache.delimit, 2);
    if (parts.length < 2) {
      await this.remove(k);
      return undefined;
    }

    const expires = new Date(Number(parts[0]));
    if (Date.now() > expires.getTime()) {
      await this.remove(k);
      return undefined;
    }

    return parts[1];
  }

  private parseRawKey(rawKey: string): string | undefined {
    const prefix = this.prefix + "_";
    if (rawKey.length <= prefix.length || rawKey.indexOf(prefix) !== 0) {
      return undefined;
    }
    return rawKey.substring(prefix.length + 1);
  }

  private async remove(fullKey: string): Promise<void> {
    return GM.deleteValue(fullKey);
  }
}
