import useSWRMutation from "swr/mutation"

import { patAuthMiddleware } from "@/auth/middleware"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"
import { WORK_ITEMS_URL } from "@/repository/constants"
import { FetcherKey, composableFetcher } from "@/repository/fetcher"
import { apiVersionMiddleware } from "@/repository/middleware"

import { addTaskMiddleware } from "./middleware"
import { Task } from "./tasks"


export function useAddTaskToWorkItem(
    workItemId: number,
    task: Task,
) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [`${WORK_ITEMS_URL}/$Task`]
    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            key,
            composableFetcher
                // .with(delayMiddleware(2000))
                // .with(apiVersionMiddleware("4.1"))
                .with(apiVersionMiddleware())
                .with(patAuthMiddleware(pat))
                .with(addTaskMiddleware(workItemId, task))
                .build(),
        )
    return { data, error, trigger, reset, isMutating }
}
