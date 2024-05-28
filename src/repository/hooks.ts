import useSWR from "swr"

import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"

import { Fetcher, FetcherKey } from "./fetcher"


/**
 * Make a call to DevOps.
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

