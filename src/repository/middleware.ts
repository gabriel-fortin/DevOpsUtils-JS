import { Middleware } from "./fetcher"
import { WorkItemDto } from "./WorkItemDto"


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
                "Accept": "application/json",
            }
        }
        const response = await next(key, augmentedOptions)
        return response.json() as Promise<WorkItemDto>
    }
