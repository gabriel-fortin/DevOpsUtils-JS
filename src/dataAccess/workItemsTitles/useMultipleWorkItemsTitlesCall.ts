import useSWR from "swr"

import { WORK_ITEMS_BATCH_URL, usePreconfiguredComposableFetcher } from "@/network"

import { readWorkItemsTitlesMiddleware } from "./readWorkItemsTitlesMiddleware"
import { requestWorkItemsTitlesMiddleware } from "./requestWorkItemsTitlesMiddleware"


export function useMultipleWorkItemsTitlesCall(
    workItems: number[],
) {
    const url = `${WORK_ITEMS_BATCH_URL}`
    const workItemsAsString = workItems.join(",")

    const { data, error } =
        useSWR(
            ...usePreconfiguredComposableFetcher()
                .with(requestWorkItemsTitlesMiddleware(workItems)).withKeyExtension(workItemsAsString)
                .with(readWorkItemsTitlesMiddleware(workItems))
                .build(url),
        )

    if (error) {
        console.log(`ERROR in ${useMultipleWorkItemsTitlesCall.name}(${workItemsAsString})`, error)
    }

    return { titles: data }
}
