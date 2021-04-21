import { FrontExchange as IFrontExchange } from "@common/messaging/exchange";
import { BackMessage, FrontMessage } from "@shared/messaging";
import { Options } from "@shared/options";

import ChangeOptions = FrontMessage.ChangeOptions;

import GetOptionsResult = BackMessage.GetOptionsResult;
import ChangeOptionsResult = BackMessage.ChangeOptionsResult;

type Request<T extends FrontMessage> = Omit<T, "kind">;
type Result<T extends BackMessage> = Omit<T, "kind">;

export class Exchange {
    private inner: Exchange.Inner;

    private constructor(inner: Exchange.Inner) {
        this.inner = inner;
    }

    static async load(inner: Exchange.Inner): Promise<Exchange> {
        const self = new Exchange(inner);
        await self.inner.connect();

        return self;
    }

    async getOptions(): Promise<Options> {
        const response = await this.inner.send({ kind: "GET_OPTIONS" });
        const result = this.extractResponse<GetOptionsResult>(response);
        return result.options;
    }

    async changeOptions(om: Request<ChangeOptions>): Promise<void> {
        await this.sendExtractResponse<ChangeOptionsResult>({
            kind: "CHANGE_OPTIONS",
            ...om,
        });
    }

    private async sendExtractResponse<T extends BackMessage>(
        om: FrontMessage,
    ): Promise<Result<T>> {
        const response = await this.inner.send(om);
        return this.extractResponse<T>(response);
    }

    private extractResponse<T extends BackMessage>(response: BackMessage): Result<T> {
        const { kind: _kind, ...result } = response;
        // Safety: Exchanges should guarantee that correct types are returned.
        // eslint-ignore-next-line @typescript-eslint/consistent-type-assertion
        return result as T;
    }
}

export namespace Exchange {
    export type Inner = IFrontExchange<BackMessage, FrontMessage>;
}
