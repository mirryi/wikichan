import { Options } from "@shared/options";
import { DeepPartial } from "@util";

export type FrontMessage = FrontMessage.GetOptions | FrontMessage.ChangeOptions;

export namespace FrontMessage {
    export interface GetOptions {
        kind: "GET_OPTIONS";
    }

    export interface ChangeOptions {
        kind: "CHANGE_OPTIONS";
        options: DeepPartial<Options>;
    }
}
