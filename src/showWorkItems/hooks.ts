import useSWR from "swr"

import { usePreconfiguredComposableFetcher } from "@/networking/preconfiguredFetchers"
import { WORK_ITEMS_URL } from "@/networking/constants"
import { FetcherUrl } from "@/networking/fetcher"

import { workItemDtoResponseMiddleware } from "./middleware"
import { WorkItemDto } from "./WorkItemDto"


export function useFetchWorkItem(
    workItemId: number,
) {
    const url: FetcherUrl = `${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`
    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...usePreconfiguredComposableFetcher()
                .with<WorkItemDto>(workItemDtoResponseMiddleware)
                .build(url),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
