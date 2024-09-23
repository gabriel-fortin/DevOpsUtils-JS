import { patAuthMiddleware } from "@/auth/middleware"
import { usePersonalAccessTokenValue } from "@/contexts/PersonalAccessTokenContext"
import { useProjectUrl } from "@/contexts/ProjectUrlContext"
import { useBasicComposableFetcher } from "@/networking/fetcher"
import { projectUrlMiddleware, apiVersionMiddleware } from "@/networking/middleware"


/**
 * A composable fetcher that has most common middleware already applied.
 */
export function usePreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const pat = usePersonalAccessTokenValue()
    const [projectUrl] = useProjectUrl()
    return useBasicComposableFetcher()
        .with(projectUrlMiddleware(projectUrl))
        .with(apiVersionMiddleware())
        .with(patAuthMiddleware(pat))
}

/**
 * A composable fetcher that has most common middleware already applied.
 * This version is merely without the auth middleware.
 */
export function useNoAuthPreconfiguredComposableFetcher(): ReturnType<typeof useBasicComposableFetcher> {
    const [projectUrl] = useProjectUrl()
    return useBasicComposableFetcher()
        .with(projectUrlMiddleware(projectUrl), projectUrl)
        .with(apiVersionMiddleware())
}
