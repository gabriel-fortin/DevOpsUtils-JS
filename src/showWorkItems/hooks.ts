import useSWR from "swr"

import { patAuthMiddleware } from "@/auth/middleware"
import { PROJECT_URL } from "@/config"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"
import { WORK_ITEMS_URL } from "@/repository/constants"
import { FetcherKey, useComposableFetcher } from "@/repository/fetcher"
import { projectUrlMiddleware } from "@/repository/middleware"

import { workItemDtoResponseMiddleware } from "./middleware"


export function useFetchWorkItem(
    workItemId: number,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [`${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`]
    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            key,
            useComposableFetcher()
                .with(projectUrlMiddleware(PROJECT_URL))
                .with(patAuthMiddleware(pat))
                .with(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
