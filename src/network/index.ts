import { API_VERSION, TAGS_URL, WIT_BATCH_URL, WORK_ITEMS_BATCH_URL, WORK_ITEMS_URL } from "./constants"
import { FetcherUrl, Middleware, useBasicComposableFetcher } from "./fetcher"
import { apiVersionMiddleware, delayMiddleware, patAuthMiddleware, projectUrlMiddleware } from "./middlewares"
import { useNoAuthPreconfiguredComposableFetcher, usePreconfiguredComposableFetcher } from "./preconfiguredFetchers"

export {
    apiVersionMiddleware, API_VERSION,
    delayMiddleware, patAuthMiddleware, projectUrlMiddleware, TAGS_URL, useBasicComposableFetcher,
    useNoAuthPreconfiguredComposableFetcher,
    usePreconfiguredComposableFetcher, WIT_BATCH_URL,
    WORK_ITEMS_URL, WORK_ITEMS_BATCH_URL,
}

export type {
    FetcherUrl,
    Middleware
}
