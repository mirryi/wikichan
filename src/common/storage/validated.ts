import * as s from "superstruct";
import { Describe as ValidationSchema } from "superstruct";

import { PlatformStorage } from "./platform";

type Validator<T> = ValidatedStorage.Validator<T>;
export namespace ValidatedStorage {
    export type Validator<T> = (val: unknown) => T | false;
}

export class ValidatedStorage<T> implements PlatformStorage<T> {
    constructor(private inner: PlatformStorage<T>, private validator: Validator<T>) {}

    async set(entries: { [key: string]: T }): Promise<void> {
        await this.inner.set(entries);
    }

    async get(keys: string[]): Promise<{ [key: string]: T }> {
        const pairs = await this.inner.get(keys);
        const entries = await Promise.all(
            Object.entries(pairs).map(async ([key, val]) => {
                if (this.validator(val) !== false) {
                    return [key, val];
                }
                return undefined;
            }),
        );

        return Object.fromEntries(entries.filter((x): x is [string, T] => !!x));
    }

    async del(keys: string[]): Promise<void> {
        await this.inner.del(keys);
    }
}

export { ValidationSchema };
export class SchemaValidatedStorage<T> extends ValidatedStorage<T> {
    constructor(inner: PlatformStorage<T>, schema: ValidationSchema<T>) {
        const validator = (x: unknown): T | false => {
            try {
                const v = s.create(x, schema);
                return v;
            } catch {
                return false;
            }
        };

        super(inner, validator);
    }
}
