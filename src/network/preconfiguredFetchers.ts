import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useOrgUrl, useProjectUrl } from "@/state/projectUrl"

import { useBasicComposableFetcher } from "./fetcher"
import { apiVersionMiddleware, patAuthMiddleware, baseUrlMiddleware } from "./middlewares"


/**
 * A composable fetcher that has most common middleware already applied.
 */
export function usePreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const { patValue } = usePersonalAccessToken()
    const { projectUrl } = useProjectUrl()

    return useBasicComposableFetcher()
        .with(baseUrlMiddleware(projectUrl)).withKeyExtension(projectUrl)
        .with(apiVersionMiddleware())
        .with(patAuthMiddleware(patValue)).withKeyExtension(patValue)
}

/**
 * A composable fetcher that has most common middleware already applied.
 * This version uses the org URL as the base URL.
 */
export function useOrgLevelPreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const { patValue } = usePersonalAccessToken()
    const orgUrl = useOrgUrl()

    return useBasicComposableFetcher()
        .with(baseUrlMiddleware(orgUrl)).withKeyExtension(orgUrl)
        .with(apiVersionMiddleware())
        .with(patAuthMiddleware(patValue)).withKeyExtension(patValue)
}

/**
 * A composable fetcher that has most common middleware already applied.
 * This version is merely without the auth middleware.
 */
export function useNoAuthPreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const { projectUrl } = useProjectUrl()

    return useBasicComposableFetcher()
        .with(baseUrlMiddleware(projectUrl)).withKeyExtension(projectUrl)
        .with(apiVersionMiddleware())
}
