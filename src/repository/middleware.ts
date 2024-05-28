import { API_VERSION } from "@/config"

import { FetcherKey, Middleware } from "./fetcher"



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
