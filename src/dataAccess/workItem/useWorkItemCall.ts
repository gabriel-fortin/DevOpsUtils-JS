import useSWR, { KeyedMutator } from "swr"

import { usePreconfiguredComposableFetcher, WORK_ITEMS_URL, FetcherUrl } from "@/network"

import { handleErrorsMiddleware } from "./handleErrorsMiddleware"
import { workItemDtoResponseMiddleware } from "./workItemDtoResponseMiddleware"
import { WorkItemDto } from "./WorkItemDto"


export function useWorkItemCall(
    workItemId: number | null,
): {
    workItemDto: WorkItemDto | undefined
    error: any // eslint-disable-line @typescript-eslint/no-explicit-any
    isLoading: boolean
    isValidating: boolean
    mutate: KeyedMutator<WorkItemDto>
} {
    const url: FetcherUrl | null = (workItemId === null)
        ? null
        : `${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`
    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...usePreconfiguredComposableFetcher()
                .with(handleErrorsMiddleware)
                .with<WorkItemDto>(workItemDtoResponseMiddleware)
                .build(url),
        )
    if (error) console.log(`ERROR in useWorkItemCall(${workItemId})`, error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
