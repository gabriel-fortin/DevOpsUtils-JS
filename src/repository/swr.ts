import useSWR from "swr"

import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"

import { WORK_ITEMS_URL } from "./constants"
import { composableFetcher, Fetcher, FetcherKey } from "./fetcher"
import { authMiddleware, workItemDtoResponseMiddleware } from "./middleware"


export function useFetchWorkItem(
    workItemId: number,
) {
    const { data, error, isLoading, isValidating, mutate } =
        useDevOpsApiInternal(
            `${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`,
            composableFetcher
                .with(authMiddleware)
                .with(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}

export function useDevOpsApi(
    localUrl: string,
    patOverride?: string,
) {
    return useDevOpsApiInternal(
        localUrl,
        composableFetcher
            .with(authMiddleware)
            .build(),
        patOverride)
}

function useDevOpsApiInternal<TFetcherReturn>(
    localUrl: string,
    fetcher: Fetcher<TFetcherReturn>,
    patOverride?: string,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [localUrl, patOverride ?? pat]
    console.debug(`🚀 ~ useDevOpsApiInternal: [${key[0]},${key[1].substring(0, 2)}...(${key[1].length})]`)
    return useSWR(key, fetcher)
}

