import useSWR from "swr"

import { WORK_ITEMS_BATCH_URL, usePreconfiguredComposableFetcher } from "@/network"

import { workItemsBatchResposeReaderMiddleware } from "./workItemsBatchResposeReaderMiddleware"
import { workItemsBatchRequestMiddleware } from "./workItemsBatchRequestMiddleware"


export function useWorkItemsBatchCall(
    workItems: number[],
) {
    const url = (workItems.length == 0) ? null : `${WORK_ITEMS_BATCH_URL}`
    const workItemsAsString = workItems.join(",")

    const { data, error } =
        useSWR(
            ...usePreconfiguredComposableFetcher()
                .with(workItemsBatchRequestMiddleware(workItems)).withKeyExtension(workItemsAsString)
                .with(workItemsBatchResposeReaderMiddleware(workItems))
                .build(url),
        )

    if (error) {
        console.log(`ERROR in ${useWorkItemsBatchCall.name}(${workItemsAsString})`, error)
    }

    return { workItemsDtos: data }
}
