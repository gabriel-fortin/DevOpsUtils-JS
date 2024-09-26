import useSWRMutation from "swr/mutation"

import { usePreconfiguredComposableFetcher } from "@/networking/preconfiguredFetchers"
import { WORK_ITEMS_URL } from "@/networking/constants"
import { FetcherUrl } from "@/networking/fetcher"

import { addTaskMiddleware } from "./middleware"
import { Task } from "./task"


export function useAddTaskToWorkItem(
    workItemId: number,
    task: Task,
) {
    const url: FetcherUrl = `${WORK_ITEMS_URL}/$Task`
    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            ...usePreconfiguredComposableFetcher()
                // .with(delayMiddleware(2000))
                // .with(apiVersionMiddleware("4.1"))
                .with(addTaskMiddleware(workItemId, task))
                .build(url),
        )
    return { data, error, trigger, reset, isMutating }
}
