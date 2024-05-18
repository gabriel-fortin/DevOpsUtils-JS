import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { Task } from "@/addingTasks/tasks"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"

import { WORK_ITEMS_URL } from "./constants"
import { composableFetcher, Fetcher, FetcherKey } from "./fetcher"
import { addTaskMiddleware, apiVersionMiddleware, authMiddleware, delayMiddleware, workItemDtoResponseMiddleware } from "./middleware"


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

export function useAddTaskToWorkItem(
    workItemId: number,
    task: Task,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [`${WORK_ITEMS_URL}/$Task`, pat]
    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            key,
            composableFetcher
                .with(delayMiddleware(2000))
                // .with(apiVersionMiddleware("4.1"))
.with(apiVersionMiddleware())
                .with(authMiddleware)
                .with(addTaskMiddleware(workItemId, task))
                .build(),
        )
            return { data, error, trigger, reset, isMutating }
}
