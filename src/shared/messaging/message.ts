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

export type BackMessage = BackMessage.GetOptionsResult | BackMessage.ChangeOptionsResult;

export namespace BackMessage {
    export interface GetOptionsResult {
        kind: "GET_OPTIONS_RESULT";
        options: Options;
    }

    export interface ChangeOptionsResult {
        kind: "CHANGE_OPTIONS_RESULT";
    }
}
