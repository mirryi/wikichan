import {
    CentralStorage,
    PlatformStorage,
    TemporaryStorage,
    ValidatedStorage,
} from "@common/storage";
import { Options } from "@shared/options";
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
            this._optionsHandle = new ValidatedStorage(handle, async (x) =>
                Options.guard(x),
            );
            return this._optionsHandle;
        }
        return undefined;
    }

    cacheHandle<T>(
        prefix: string,
        validator: (x: unknown) => Promise<boolean>,
    ): CacheHandle<T> | undefined {
        if (prefix in Object.values(PREFIXES)) {
            return undefined;
        }

        const handle = this.registerHandle<StoredValue<T>>(prefix);
        if (handle) {
            const wrappedValidator = async (x: unknown) => {
                // eslint-ignore-next-line @typescript-eslint/no-explicit-any
                const v = x as any;
                return (
                    (v?.expires === undefined || typeof v?.expires === "number") &&
                    validator(v?.payload)
                );
            };

            return new TemporaryStorage(new ValidatedStorage(handle, wrappedValidator));
        } else {
            return undefined;
        }
    }
}
