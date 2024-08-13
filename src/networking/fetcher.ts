export type FetcherKey = [string]
export type Fetcher<T> = (key: FetcherKey) => Promise<T>
type FetcherWithOptions<T> = (key: FetcherKey, options: RequestInit) => Promise<T>

export type Middleware<T1, T2> = (
    key: FetcherKey,
    options: RequestInit,
    next: FetcherWithOptions<T1>,
) => Promise<T2>
type KeyEnlarger = (inputKey: FetcherKey) => FetcherKey

interface ComposableFetcherBuilder<TReturn> {
    /**
     * Expands what the bare fetch operations does
     * and what the key is (to trigger re-fetching when it changes)
     * @param middleware will enhance the the fetching process by adding payload, headers,
     *  validation, response parsing and much more 
     * @returns an new instance of the builder which can build an enhanced fetcher
    */
    with: <TNewReturn> (
        keyEnlarger: KeyEnlarger,
        middleware: Middleware<TReturn, TNewReturn>,
    ) => ComposableFetcherBuilder<TNewReturn>
    // with: <TNewReturn> (middleware: Middleware<TReturn, TNewReturn>) => ComposableFetcherBuilder<TNewReturn>

    /**
     * Bulids a fetcher which applies all the enhancements present in this builder
     * @returns a key and a fetcher to use with `useSWR`
     */
    build: (inputKey: FetcherKey) => [FetcherKey, Fetcher<TReturn>]
}

const IDENTITY: KeyEnlarger = key => key

class BuilderImpl<TReturn> implements ComposableFetcherBuilder<TReturn> {
    keyEnlarger: KeyEnlarger
    fetcher: FetcherWithOptions<TReturn>

    constructor(keyEnlarger: KeyEnlarger | null, fetcher: FetcherWithOptions<TReturn>) {
        this.keyEnlarger = keyEnlarger ?? IDENTITY
        this.fetcher = fetcher
    }

    with<TNewReturn>(keyEnlarger: KeyEnlarger, middleware: Middleware<TReturn, TNewReturn>)
        : ComposableFetcherBuilder<TNewReturn> {
        const enhancedEnlarger: KeyEnlarger =
            (key) => keyEnlarger(this.keyEnlarger(key))
        const enhancedFetcher: FetcherWithOptions<TNewReturn> =
            (key, opts) => middleware(key, opts, this.fetcher)
        return new BuilderImpl(enhancedEnlarger, enhancedFetcher)
    }

    build(inputKey: FetcherKey): [FetcherKey, Fetcher<TReturn>] {
        return [this.keyEnlarger(inputKey), key => this.fetcher(key, {} as RequestInit)]
    }
}

const coreFetcher: FetcherWithOptions<Response> =
    (key: FetcherKey, options: RequestInit) => {
        const [url] = key
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
