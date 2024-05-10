import { SelectableTask } from "@/addingTasks/tasks"
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


export const addTasksMiddleware: <T> (
    workItemId: number,
    tasks: SelectableTask[],
) => Middleware<T, T> =
    (workItemId, tasks) =>
        async (key, options, next) => {
            const payload = tasks
                .map(task => preparePostData(workItemId, task))
            const augmentedOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    // "Accept": "application/json",
                    "Content-Type": "application/json-patch+json",
                },
                method: "PATCH",
                body: JSON.stringify(payload),
            }

            //????

            return next(key, augmentedOptions)
        }



function preparePostData(workItemId: number, task: SelectableTask) {
    return {
        // method: "POST",
        method: "PATCH",
        // uri: `${BASE_URL}${WORK_ITEMS_URL}$Task`,
        uri: `/playground-project/_apis/${WORK_ITEMS_URL}/$Task`,
        headers: {
            // "Content-Type": "application/json-patch+json",
        },
        body: [
            {
                "op": "add",
                "path": "/id",
                "value": "-14"
            },
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
                    url: `${BASE_URL}${WORK_ITEMS_URL}/${workItemId}`,
                },
            },
        ],
    }
}