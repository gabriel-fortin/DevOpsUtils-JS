import useSWR from "swr"

import { usePreconfiguredComposableFetcher } from "@/networking/preconfiguredFetchers"
import { WORK_ITEMS_URL } from "@/networking/constants"
import { FetcherKey } from "@/networking/fetcher"

import { workItemDtoResponseMiddleware } from "./middleware"
import { WorkItemDto } from "./WorkItemDto"


export function useFetchWorkItem(
    workItemId: number,
) {
    const key: FetcherKey = [`${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`]
    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            key,
            usePreconfiguredComposableFetcher()
                .with<WorkItemDto>(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
