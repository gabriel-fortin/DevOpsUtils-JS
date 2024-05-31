import useSWRMutation from "swr/mutation"

import { usePreconfiguredComposableFetcher } from "@/niceties"
import { WORK_ITEMS_URL } from "@/repository/constants"
import { FetcherKey } from "@/repository/fetcher"

import { addTaskMiddleware } from "./middleware"
import { Task } from "./tasks"


export function useAddTaskToWorkItem(
    workItemId: number,
    task: Task,
) {
    const key: FetcherKey = [`${WORK_ITEMS_URL}/$Task`]
    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            key,
            usePreconfiguredComposableFetcher()
                // .with(delayMiddleware(2000))
                // .with(apiVersionMiddleware("4.1"))
                .with(addTaskMiddleware(workItemId, task))
                .build(),
        )
    return { data, error, trigger, reset, isMutating }
}
