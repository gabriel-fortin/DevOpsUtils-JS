import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useProjectUrl } from "@/state/projectUrl"

import { useBasicComposableFetcher } from "./fetcher"
import { apiVersionMiddleware, patAuthMiddleware, projectUrlMiddleware } from "./middlewares"


/**
 * A composable fetcher that has most common middleware already applied.
 */
export function usePreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const { patValue } = usePersonalAccessToken()
    const { projectUrl } = useProjectUrl()

    return useBasicComposableFetcher()
        .with(projectUrlMiddleware(projectUrl)).withKeyExtension(projectUrl)
        .with(apiVersionMiddleware())
        .with(patAuthMiddleware(patValue))
}

/**
 * A composable fetcher that has most common middleware already applied.
 * This version is merely without the auth middleware.
 */
export function useNoAuthPreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const { projectUrl } = useProjectUrl()

    return useBasicComposableFetcher()
        .with(projectUrlMiddleware(projectUrl)).withKeyExtension(projectUrl)
        .with(apiVersionMiddleware())
}
