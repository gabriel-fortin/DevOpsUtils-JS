import useSWRMutation from "swr/mutation"

import { FetcherUrl, usePreconfiguredComposableFetcher, WORK_ITEMS_URL } from "@/network"

import { useWorkItemCall } from "../workItem"
import { addTaskMiddleware } from "./addTaskMiddleware"
import { Task } from "./Task"


export function useAddTaskCall(
    workItemId: number,
    task: Task,
    projectUrl: string | null,
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

    // after adding a child task, the parent work item will be out of date
    // it needs refreshing
    const { mutate: refreshParentWorkItem } = useWorkItemCall(workItemId)
    const autoRefreshingTrigger: () => ReturnType<typeof trigger> =
        async () => {
            const whateverIsReturned = await trigger()
            refreshParentWorkItem()
            return whateverIsReturned
        }

    return { data, error, trigger: autoRefreshingTrigger, reset, isMutating }
}
