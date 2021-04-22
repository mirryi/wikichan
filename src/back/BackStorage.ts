import {
    CentralStorage,
    PlatformStorage,
    TemporaryStorage,
    ValidatedStorage,
} from "@common/storage";
import { Options } from "@shared/options";
import { isOptions } from "@shared/options/guard";
import { Immutable } from "@util";

import StoredValue = TemporaryStorage.StoredValue;

const PREFIXES: Immutable<{ SETTINGS: string }> = { SETTINGS: "SETTINGS" };

export type CacheHandle<T> = TemporaryStorage<T>;
export type OptionsHandle = ValidatedStorage<Options>;

export type InnerStorage = PlatformStorage<unknown>;
export class BackStorage extends CentralStorage {
    private _optionsHandle?: ValidatedStorage<Options> = undefined;

    constructor(inner: InnerStorage) {
        super(inner);
    }

    optionsHandle(): OptionsHandle | undefined {
        if (this._optionsHandle) {
            return this._optionsHandle;
        }

        const handle = this.registerHandle<Options>(PREFIXES.SETTINGS);
        if (handle) {
            this._optionsHandle = new ValidatedStorage(handle, isOptions);
            return this._optionsHandle;
        }
        return undefined;
    }

    cacheHandle<T>(
        prefix: string,
        validator: (x: unknown) => x is T,
    ): CacheHandle<T> | undefined {
        if (prefix in Object.values(PREFIXES)) {
            return undefined;
        }

        const handle = this.registerHandle<StoredValue<T>>(prefix);
        if (handle) {
            const wrappedValidator = (x: unknown): x is StoredValue<T> => {
                // Safety: necessary for type guard
                /* eslint-disable @typescript-eslint/consistent-type-assertions */
                if (typeof x !== "object") {
                    return false;
                }

                const expires = (x as StoredValue<T>).expires;
                return (
                    (expires === undefined || typeof expires === "number") &&
                    validator((x as StoredValue<T>).payload)
                );
                /* eslint-enable @typescript-eslint/consistent-type-assertions */
            };

            return new TemporaryStorage(new ValidatedStorage(handle, wrappedValidator));
        } else {
            return undefined;
        }
    }
}
