import { Task } from "@/addingTasks/tasks"
import { FetcherKey, Middleware } from "./fetcher"
import { WorkItemDto } from "./WorkItemDto"
import { WORK_ITEMS_URL } from "./constants"
import { API_VERSION, BASE_URL } from "@/config"


export const authMiddleware: Middleware<Response, Response> =
    (key, options, next) => {
        const [_localUrl, pat] = key
        const augmentedOptions = {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Basic ${btoa(":" + pat)}`,
            }
        }
        return next(key, augmentedOptions)
    }

export const workItemDtoResponseMiddleware: Middleware<Response, WorkItemDto> =
    async (key, options, next) => {
        const augmentedOptions = {
            ...options,
            headers: {
                ...options.headers,
                // "Accept": "application/json",
                "Content-Type": "application/json-patch+json",
            },
        }
        const response = await next(key, augmentedOptions)
        return response.json() as Promise<WorkItemDto>
    }

export const apiVersionMiddleware: <T> (
    version?: string,
) => Middleware<T, T> =
    (version) =>
        async (key, options, next) => {
            const [url, pat] = key

            const joinChar = url.includes("?") ? "&" : "?"
            const newKey: FetcherKey =
                [url + joinChar + "api-version=" + (version ?? API_VERSION), pat]
            return next(newKey, options)
        }

export const delayMiddleware: (
    delayMs: number
) => Middleware<Response, Response> =
    (delayMs) =>
        async (key, options, next) => {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve(next(key, options))
                }, delayMs)
            })
        }

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
                url: `${BASE_URL}/${WORK_ITEMS_URL}/${workItemId}`,
            },
        },
    ]
}
