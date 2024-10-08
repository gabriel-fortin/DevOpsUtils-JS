/** The type of the URL we use with 'fetch'; it is also the first element of 'FetcherKey' */
export type FetcherUrl = string // we could also include 'URL' and 'Request' in this type

/** What we promise ourselves we'll always use as the key (which eventually is passed to SWR) */
export type FetcherKey = [FetcherUrl, ...any[]]

/** A fetcher accepting request options and returning the specified type */
export type FetcherWithOptions<TReturn> = (key: FetcherKey, options: RequestInit) => Promise<TReturn>

/** A transformator which can extend or modify options for the request and which can convert the response */
export type Middleware<TReturn1, TReturn2> = (
    key: FetcherKey,
    options: RequestInit,
    next: FetcherWithOptions<TReturn1>,
) => Promise<TReturn2>

/** Allows building a fetcher for SWR in a flexible way by composing middleware */
interface ComposableFetcherBuilder<TReturn> {
    /**
     * Allows to expand what the bare fetch operations does
     * and what the key is (to trigger re-fetching when it changes)
     * @param middleware will enhance the fetching process by adding payload, headers,
     *  validation, response parsing and much more 
     * @returns an new instance of the builder which can build an enhanced fetcher
    */
    with: <TNewReturn> (_: Middleware<TReturn, TNewReturn>, keyExtension?: any) => ComposableFetcherBuilder<TNewReturn>

    /**
     * Builds a fetcher which will execute all the composed middleware
     */
    build: (url: FetcherUrl | null) => [FetcherKey | null, (key: FetcherKey) => Promise<TReturn>]
}

class BuilderImpl<TReturn> implements ComposableFetcherBuilder<TReturn> {
    innerFetcher: FetcherWithOptions<TReturn>
    fetcherKeyAdditions: any[]

    constructor(innerFetcher: FetcherWithOptions<TReturn>, fetcherKeyAdditions: any[]) {
        this.innerFetcher = innerFetcher
        this.fetcherKeyAdditions = fetcherKeyAdditions
    }

    with<TNewReturn>(middleware: Middleware<TReturn, TNewReturn>, keyExtension?: any): ComposableFetcherBuilder<TNewReturn> {
        return new BuilderImpl(
            (key, opts) => middleware(key, opts, this.innerFetcher),
            keyExtension === undefined ? this.fetcherKeyAdditions : [...this.fetcherKeyAdditions, keyExtension],
        )
    }

    build(url: FetcherUrl | null): [FetcherKey | null, (_key: FetcherKey) => Promise<TReturn>] {
        // if 'url' is null, we want SWR to not make a request (because what's the point of making a request with no URL)
        // SWR will not make a request if the key it receives is null
        const actualKeyForSwr: FetcherKey | null = (url == null) ? null : [url, this.fetcherKeyAdditions]
        return [
            actualKeyForSwr,
            key => this.innerFetcher(key, {} as RequestInit)
        ]
    }
}

// the base of the middleware pipeline
const coreFetcher: FetcherWithOptions<Response> =
    ([url]: FetcherKey, options: RequestInit) => {
        console.debug(`🚀 ~ coreFetcher ~ URL: ${url} \n options:`, options)
        return fetch(url, options)
    }

export function useBasicComposableFetcher(): ComposableFetcherBuilder<Response> {
    return new BuilderImpl(coreFetcher, [])
}
