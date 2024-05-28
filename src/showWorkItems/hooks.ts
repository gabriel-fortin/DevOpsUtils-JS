import useSWR from "swr"

import { patAuthMiddleware } from "@/auth/middleware"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"
import { WORK_ITEMS_URL } from "@/repository/constants"
import { FetcherKey, composableFetcher } from "@/repository/fetcher"

import { workItemDtoResponseMiddleware } from "./middleware"


export function useFetchWorkItem(
    workItemId: number,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [`${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`]
    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            key,
            composableFetcher
                .with(patAuthMiddleware(pat))
                .with(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
