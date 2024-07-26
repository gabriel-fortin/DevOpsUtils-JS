import { Middleware } from "@/networking/fetcher"


export const patAuthMiddleware: (
    pat: string
) => Middleware<Response, Response> =
    (pat) =>
        (key, options, next) => {
            const augmentedOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Basic ${btoa(":" + pat)}`,
                }
            }
            return next(key, augmentedOptions)
        }
