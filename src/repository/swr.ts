import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { SelectableTask } from "@/addingTasks/tasks"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"

import { WIT_BATCH_URL, WORK_ITEMS_URL } from "./constants"
import { composableFetcher, Fetcher, FetcherKey } from "./fetcher"
import { addTasksMiddleware, apiVersionMiddleware, authMiddleware, workItemDtoResponseMiddleware } from "./middleware"


export function useFetchWorkItem(
    workItemId: number,
) {
    const { data, error, isLoading, isValidating, mutate } =
        useDevOpsApiInternal(
            `${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`,
            composableFetcher
                .with(authMiddleware)
                .with(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}

export function useDevOpsApi(
    localUrl: string,
    patOverride?: string,
) {
    return useDevOpsApiInternal(
        localUrl,
        composableFetcher
            .with(authMiddleware)
            .build(),
        patOverride)
}

function useDevOpsApiInternal<TFetcherReturn>(
    localUrl: string,
    fetcher: Fetcher<TFetcherReturn>,
    patOverride?: string,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [localUrl, patOverride ?? pat]
    console.debug(`🚀 ~ useDevOpsApiInternal: [${key[0]},${key[1].substring(0, 2)}...(${key[1].length})]`)
    return useSWR(key, fetcher)
}

export function useAddTasksToWorkItem(
    workItemId: number | null,
    tasks: SelectableTask[],
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [WIT_BATCH_URL, pat]
    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            key,
            composableFetcher
                .with(apiVersionMiddleware("4.1"))
                .with(authMiddleware)
                // TODO: remove the need for the workItemId argument to be null
                    // we should not need to have a hack with a -1 to appease the rule of hooks
                .with(addTasksMiddleware(workItemId ?? -1, tasks))
                .build(),
        )
        if (workItemId === null) {
            return {
                data: null,
                error: null,
                trigger: () => {
                    throw new Error(`The called trigger created by ${useAddTasksToWorkItem.name} but work item id is null`)
                }
            }
        }
    return { data, error, trigger, reset, isMutating }
}
