import { FetcherUrl, Middleware, useBasicComposableFetcher } from "./fetcher"
import { apiVersionMiddleware, delayMiddleware, patAuthMiddleware, baseUrlMiddleware } from "./middlewares"
import { useNoAuthPreconfiguredComposableFetcher, usePreconfiguredComposableFetcher } from "./preconfiguredFetchers"

export * from "./constants"

export {
    apiVersionMiddleware, delayMiddleware, patAuthMiddleware, baseUrlMiddleware,
    useBasicComposableFetcher,
    useNoAuthPreconfiguredComposableFetcher,
    usePreconfiguredComposableFetcher,
}

export type {
    FetcherUrl,
    Middleware
}
