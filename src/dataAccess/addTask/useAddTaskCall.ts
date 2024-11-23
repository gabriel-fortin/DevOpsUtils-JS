import useSWRMutation from "swr/mutation"

import { FetcherUrl, usePreconfiguredComposableFetcher, WORK_ITEMS_URL } from "@/network"

import { addTaskMiddleware } from "./addTaskMiddleware"
import { Task } from "./Task"


export function useAddTaskCall(
    workItemId: number,
    task: Task,
    projectUrl: string|null,
) {
    const url: FetcherUrl = `${WORK_ITEMS_URL}/$Task`

    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            ...usePreconfiguredComposableFetcher()
                // .with(delayMiddleware(2000))
                // .with(apiVersionMiddleware("4.1"))
                .with(addTaskMiddleware(workItemId, task, projectUrl))
                .build(url),
        )
    return { data, error, trigger, reset, isMutating }
}
