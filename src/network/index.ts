import { FetcherUrl, FetcherKey, Middleware, useBasicComposableFetcher } from "./fetcher"
import { apiVersionMiddleware, delayMiddleware, patAuthMiddleware, baseUrlMiddleware } from "./middlewares"
import { useNoAuthPreconfiguredComposableFetcher, usePreconfiguredComposableFetcher, useOrgLevelPreconfiguredComposableFetcher } from "./preconfiguredFetchers"

export * from "./constants"

export {
    apiVersionMiddleware, delayMiddleware, patAuthMiddleware, baseUrlMiddleware,
    useBasicComposableFetcher,
    useNoAuthPreconfiguredComposableFetcher,
    usePreconfiguredComposableFetcher,
    useOrgLevelPreconfiguredComposableFetcher,
}

export type {
    FetcherUrl,
    FetcherKey,
    Middleware
}
