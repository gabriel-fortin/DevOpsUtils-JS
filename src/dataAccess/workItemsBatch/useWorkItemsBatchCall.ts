import useSWR, { KeyedMutator } from "swr"

import { WORK_ITEMS_BATCH_URL, usePreconfiguredComposableFetcher } from "@/network"
import { WorkItemDto } from "@/dataAccess/workItem"

import { workItemsBatchResposeReaderMiddleware } from "./workItemsBatchResposeReaderMiddleware"
import { workItemsBatchRequestMiddleware } from "./workItemsBatchRequestMiddleware"


export function useWorkItemsBatchCall(
    workItems: number[],
): {
    workItemsDtos: WorkItemDto[] | undefined
    error: any // eslint-disable-line @typescript-eslint/no-explicit-any
    isLoading: boolean
    isValidating: boolean
    mutate: KeyedMutator<WorkItemDto[]>
} {
    const url = (workItems.length == 0) ? null : `${WORK_ITEMS_BATCH_URL}`
    const workItemsAsString = workItems.join(",")

    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...usePreconfiguredComposableFetcher()
                .with(workItemsBatchRequestMiddleware(workItems)).withKeyExtension(workItemsAsString)
                .with(workItemsBatchResposeReaderMiddleware(workItems))
                .build(url),
        )

    if (error) {
        console.log(`ERROR in ${useWorkItemsBatchCall.name}(${workItemsAsString})`, error)
    }

    return { workItemsDtos: data, error, isLoading, isValidating, mutate }
}
