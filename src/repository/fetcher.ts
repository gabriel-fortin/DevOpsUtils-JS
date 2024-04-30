import { API_VERSION, BASE_URL } from "@/config"


export type FetcherKey = [string, string]
export type Fetcher<T> = (key: FetcherKey) => Promise<T>
type FetcherWithOptions<T> = (key: FetcherKey, options: RequestInit) => Promise<T>

export type Middleware<T1, T2> = (
    key: FetcherKey,
    options: RequestInit,
    next: FetcherWithOptions<T1>,
) => Promise<T2>

interface ComposableFetcherBuilder<TReturn> {
    with: <TNewReturn> (_: Middleware<TReturn, TNewReturn>) => ComposableFetcherBuilder<TNewReturn>
    build: () => Fetcher<TReturn>
}

class BuilderImpl<TReturn> implements ComposableFetcherBuilder<TReturn> {
    constructor(innerFetcher: FetcherWithOptions<TReturn>) {
        this.innerFetcher = innerFetcher
    }
    innerFetcher: FetcherWithOptions<TReturn>
    with<TNewReturn>(middleware: Middleware<TReturn, TNewReturn>): ComposableFetcherBuilder<TNewReturn> {
        return new BuilderImpl((key, opts) => middleware(key, opts, this.innerFetcher))
    }
    build(): Fetcher<TReturn> {
        return key => this.innerFetcher(key, {} as RequestInit)
    }
}

const coreFetcher: FetcherWithOptions<Response> =
    ([localUrl, _pat]: FetcherKey, options: RequestInit) => {
        const joinChar = localUrl.includes("?") ? "&" : "?"
        return fetch(BASE_URL + localUrl + joinChar + API_VERSION, options)
    }

export const composableFetcher: ComposableFetcherBuilder<Response> =
    new BuilderImpl(coreFetcher)


