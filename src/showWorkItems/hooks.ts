import useSWR from "swr"

import { usePreconfiguredComposableFetcher } from "@/niceties"
import { WORK_ITEMS_URL } from "@/repository/constants"
import { FetcherKey } from "@/repository/fetcher"

import { workItemDtoResponseMiddleware } from "./middleware"


export function useFetchWorkItem(
    workItemId: number,
) {
    const key: FetcherKey = [`${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`]
    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            key,
            usePreconfiguredComposableFetcher()
                .with(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
