type Callback = (...args: any) => any;

type Result<R> = [Error, null] | [null, R];

type MaybeAsyncResult<R> = R extends Promise<infer U> ? Promise<Result<U>> : Result<R>;

export function async<TCallback extends Callback>(cb: TCallback, ...args: Parameters<TCallback>): MaybeAsyncResult<ReturnType<TCallback>> {
    try {
        const result = cb(...(args as Array<unknown>));

        if (result instanceof Promise) {
            return result.then((rx) => [null, rx]).catch((error) => [error, null]) as MaybeAsyncResult<ReturnType<TCallback>>;
        }

        return [null, result] as MaybeAsyncResult<ReturnType<TCallback>>;
    } catch (error) {
        return [error, null] as MaybeAsyncResult<ReturnType<TCallback>>;
    }
}
