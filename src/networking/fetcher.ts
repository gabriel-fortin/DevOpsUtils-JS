import { url } from "inspector"

export type FetchUrl = string

type KeyForSwr = [FetchUrl, ...any]

export type ParameterisedFetcher<TResult, TParam> = (
    url: FetchUrl,
    options: RequestInit,
    param: [TParam],
) => Promise<TResult>

export type ParamDistributingFetcher<TResult, TParam> = (
    url: FetchUrl,
    options: RequestInit,
    paramList: [...[any], TParam],
) => Promise<TResult>

type Fetcher<TResult> = (
    url: FetchUrl,
    options: RequestInit,
) => Promise<TResult>

type FetcherForSwrCall<TResult> = (
    key: KeyForSwr,
    options: RequestInit,
) => Promise<TResult>

export type Middleware<TInnerResult, TOwnResult, TParam> = (
    url: FetchUrl,
    options: RequestInit,
    param: TParam,
    next: Fetcher<TInnerResult>,
) => Promise<TOwnResult>


interface ComposableFetcherBuilder<TResult, TParam> {
    /**
     * Expands what the bare fetch operations does
     * and what the key is (to trigger re-fetching when it changes)
     * @param middleware will enhance the the fetching process by adding payload, headers,
     *  validation, response parsing and much more 
     * @returns an new instance of the builder which can build an enhanced fetcher
    */
    // TODO: update doc comments
    with: <TNewResult, TNewParam> (
        param: TNewParam,
        middleware: Middleware<TResult, TNewResult, TNewParam>,
    ) => ComposableFetcherBuilder<TNewResult, TNewParam>

    /**
     * Bulids a fetcher which applies all the enhancements present in this builder
     * @returns a key and a fetcher to use with `useSWR`
     */
    build: (url: FetchUrl) => [KeyForSwr, FetcherForSwrCall<TResult>]
}

class BuilderImplLayer<TResult, TParam> implements ComposableFetcherBuilder<TResult, TParam> {
    fetcher: ParamDistributingFetcher<TResult, TParam>
    // nextBuilder: BuilderImplLayer<TResult, TParam> | BuilderImplRoot<TResult>
    // param: TParam
    paramList: [...[any], TParam]

    constructor(
        paramList: [...[any], TParam],
        fetcher: ParamDistributingFetcher<TResult, TParam>,
    ) {
        // this.param = param
        this.paramList = paramList
        this.fetcher = fetcher
        // this.nextBuilder = nextBuilder
    }

    with<TNewResult, TNewParam>(newParam: TNewParam, middleware: Middleware<TResult, TNewResult, TNewParam>)
        : ComposableFetcherBuilder<TNewResult, TNewParam> {

        const newFetcher: ParamDistributingFetcher<TNewResult, TNewParam> =
            (url, opts, paramList) => {
                const [newParam, ...innerParams] = paramList.reverse()

                const nextThunk: Fetcher<TResult>
                    = (url, opts) => this.fetcher(url, opts, innerParams as unknown as [...[any], TParam])

                return middleware(url, opts, newParam, nextThunk)
            }

        return new BuilderImplLayer<TNewResult, TNewParam>(
            [...this.paramList as unknown as [any], newParam],
            newFetcher)
    }

    build(url: FetchUrl): [KeyForSwr, Fetcher<TResult>] {
        const key = [?url, ???]
    }
}

class BuilderImplRoot<TResult> implements ComposableFetcherBuilder<TResult> {
    fetcher: Fetcher<TResult>

    constructor(fetcher: Fetcher<TResult>) {
        this.fetcher = fetcher
    }

    with<TNewResult, TNewParam>(
        newParam: TNewParam,
        middleware: Middleware<TResult, TNewResult, TNewParam>
    ): ComposableFetcherBuilder<TNewResult> {

    }
}

// const coreFetcher: FetcherWithOptions<Response> =
//     (key: FetcherKey, options: RequestInit) => {
//         const [url] = key
//         console.debug(`🚀 ~ coreFetcher ~ URL: ${url} \n options:`, options)
//         return fetch(url, options)
//     }
const coreFetcher: ParameterisedFetcher<Response, FetchUrl> =
    // the 'param' happens to be the exact same as 'url'
    (url: FetchUrl, options: RequestInit, _param: FetchUrl) => {
        console.debug(`🚀 ~ coreFetcher ~ URL: ${url} \n options:`, options)
        return fetch(url, options)
    }
// (key: FetcherKey, options: RequestInit) => {
//     const url = key
//     console.debug(`🚀 ~ coreFetcher ~ URL: ${url} \n options:`, options)
//     return fetch(url[0], options)
// }

export function useBasicComposableFetcher(): ComposableFetcherBuilder<Response> {
    return new BuilderImpl(null, coreFetcher)
}
