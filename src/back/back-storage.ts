import {
    CentralStorage,
    PlatformStorage,
    TemporaryStorage,
    ValidatedStorage,
    SchemaValidatedStorage,
    ValidationSchema,
} from "@common/storage";
import { Options } from "@shared/options";
import { Immutable } from "@util";

import StoredValue = TemporaryStorage.StoredValue;

const PREFIXES: Immutable<{ SETTINGS: string }> = { SETTINGS: "SETTINGS" };

export type OptionsHandle = SchemaValidatedStorage<Options>;
export type CacheHandle<T> = TemporaryStorage<T>;

export type InnerStorage = PlatformStorage<unknown>;
export class BackStorage extends CentralStorage {
    private _optionsHandle?: OptionsHandle;

    constructor(inner: InnerStorage) {
        super(inner);
    }

    optionsHandle(): OptionsHandle | undefined {
        if (this._optionsHandle) {
            return this._optionsHandle;
        }

        const handle = this.registerHandle<Options>(PREFIXES.SETTINGS);
        if (handle) {
            this._optionsHandle = new SchemaValidatedStorage(handle, Options.Schema);
            return this._optionsHandle;
        }
        return undefined;
    }

    cacheHandle<T>(
        prefix: string,
        payloadSchema: ValidationSchema<T>,
    ): CacheHandle<T> | undefined {
        if (prefix in Object.values(PREFIXES)) {
            return undefined;
        }

        const handle = this.registerHandle<StoredValue<T>>(prefix);

        if (handle) {
            const wrappedValidator = (x: unknown): StoredValue<T> | false => {
                if (typeof x !== "object") {
                    return false;
                }

                // Safety: necessary for type guard
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                const v = x as StoredValue<T>;
                return (v.expires === undefined || typeof v.expires === "number") &&
                    payloadSchema.is(v.payload)
                    ? v
                    : false;
            };

            return new TemporaryStorage(new ValidatedStorage(handle, wrappedValidator));
        } else {
            return undefined;
        }
    }
}
