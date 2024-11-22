import useSWR from "swr"

import { usePreconfiguredComposableFetcher, WORK_ITEMS_URL, FetcherUrl } from "@/network"

import { workItemDtoResponseMiddleware } from "./workItemDtoResponseMiddleware"
import { WorkItemDto } from "./WorkItemDto"


export function useWorkItemCall(
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
