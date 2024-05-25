import { Middleware } from "@/repository/fetcher"

import { WorkItemDto } from "./WorkItemDto"


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
