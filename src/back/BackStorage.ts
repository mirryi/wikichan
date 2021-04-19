import CentralStorage, { StorageHandle } from "@common/storage/CentralStorage";
import PlatformStorage from "@common/storage/PlatformStorage";
import TemporaryStorage, { StoredValue } from "@common/storage/TemporaryStorage";
import Options from "./Settings";

const PREFIXES: Immutable<{ SETTINGS: string }> = { SETTINGS: "SETTINGS" };

export type CacheHandle<T> = TemporaryStorage<T>;
export type OptionsHandle = StorageHandle<Options>;

export type InnerStorage = PlatformStorage<unknown>;
class BackStorage extends CentralStorage {
    private _optionsHandle?: StorageHandle<Options> = undefined;

    constructor(inner: InnerStorage) {
        super(inner);
    }

    optionsHandle(): OptionsHandle {
        this._optionsHandle = this.registerHandle<Options>(PREFIXES.SETTINGS, async (x) =>
            Options.guard(x),
        );
        return this._optionsHandle;
    }

    cacheHandle<T>(
        prefix: string,
        validator: (x: unknown) => Promise<boolean>,
    ): CacheHandle<T> {
        const wrappedValidator = async (x: unknown) => {
            // eslint-ignore-next-line @typescript-eslint/no-explicit-any
            const v = x as any;
            return (
                (v?.expires === undefined || typeof v?.expires === "number") &&
                validator(v?.payload)
            );
        };

        const handle = this.registerHandle<StoredValue<T>>(prefix, wrappedValidator);
        return new TemporaryStorage(handle);
    }
}

export default BackStorage;
