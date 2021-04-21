import { Options } from "@shared/options";

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
