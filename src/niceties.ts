import { PROJECT_URL } from "@/config"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"

import { useBasicComposableFetcher } from "@/networking/fetcher"
import { projectUrlMiddleware, apiVersionMiddleware } from "@/networking/middleware"
import { patAuthMiddleware } from "@/auth/middleware"


/**
 * A composable fetcher that has most common middleware already applied.
 */
export function usePreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const pat = usePersonalAccessToken()
    return useBasicComposableFetcher()
        .with(projectUrlMiddleware(PROJECT_URL))
        .with(apiVersionMiddleware())
        .with(patAuthMiddleware(pat))
}

/**
 * A composable fetcher that has most common middleware already applied.
 * This version is merely without the auth middleware.
 */
export function useNoAuthPreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    return useBasicComposableFetcher()
        .with(projectUrlMiddleware(PROJECT_URL))
        .with(apiVersionMiddleware())
}
