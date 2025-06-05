import { Middleware } from "@/network"

export const handleErrorsMiddleware: Middleware<Response, Response> =
    async (key, options, next) => {
        const response = await next(key, options)

        if (response.status === 404) {
            throw new NotFoundError(`work item not found; SWR key was '${key}'`)
        }
        if (!response.ok) {
            throw new Error(`issue while getting work item; SWR key was '${key}' ` +
                `and the response was: ${JSON.stringify(response)}`)
        }

        return response
    }

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}