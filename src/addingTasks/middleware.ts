
import { PROJECT_URL } from "@/config"
import { WORK_ITEMS_URL } from "@/networking/constants"
import { Middleware } from "@/networking/fetcher"

import { Task } from "./tasks"


export const addTaskMiddleware: <T> (
    workItemId: number,
    task: Task,
) => Middleware<T, T> =
    (workItemId, task) =>
        async (key, options, next) => {
            const payload = preparePostData(workItemId, task)
            const augmentedOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json-patch+json",
                },
                method: "POST",
                body: JSON.stringify(payload),
            }
            return next(key, augmentedOptions)
        }

function preparePostData(workItemId: number, task: Task) {
    return [
        {
            op: "add",
            path: "/fields/System.Title",
            from: null,
            value: task.getTitle(),
        },
        {
            op: "add",
            path: "/relations/-",
            from: null,
            value: {
                rel: "System.LinkTypes.Hierarchy-Reverse",
                url: `${PROJECT_URL}/${WORK_ITEMS_URL}/${workItemId}`,
            },
        },
    ]
}