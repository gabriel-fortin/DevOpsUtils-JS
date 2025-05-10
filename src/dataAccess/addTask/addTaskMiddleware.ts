
import { WORK_ITEMS_URL, Middleware } from "@/network"

import { Task } from "./Task"


export const addTaskMiddleware: <T> (
    _workItemId: number,
    _task: Task,
    _projectUrl: string | null,
) => Middleware<T, T> =
    (workItemId, task, projectUrl) =>
        async (key, options, next) => {
            if (!projectUrl) {
                throw new Error(`${addTaskMiddleware.name}: project URL is not set'`)
            }

            const payload = preparePostData(workItemId, task, projectUrl)
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

function preparePostData(workItemId: number, task: Task, projectUrl: string) {
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
                url: `${projectUrl}/${WORK_ITEMS_URL}/${workItemId}`,
            },
        },
    ]
}