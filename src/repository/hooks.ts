import useSWR from "swr"

import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"

import { composableFetcher, Fetcher, FetcherKey } from "./fetcher"
import { authMiddleware } from "./middleware"


/**
 * Make a call to DevOps
 */
export function useDevOpsApi(
    localUrl: string,
    patOverride?: string,
) {
    return useDevOpsApi2(
        localUrl,
        composableFetcher
            .with(authMiddleware)
            .build(),
        patOverride)
}

/**
 * Make a call to DevOps.
 * This version allows to set the fetcher that will make the request
 */
export function useDevOpsApi2<TFetcherReturn>(
    localUrl: string,
    fetcher: Fetcher<TFetcherReturn>,
    patOverride?: string,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [localUrl, patOverride ?? pat]
    console.debug(`🚀 ~ useDevOpsApiInternal: [${key[0]},${key[1].substring(0, 2)}...(${key[1].length})]`)
    return useSWR(key, fetcher)
}

