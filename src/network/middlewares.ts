import { API_VERSION } from "@/config"

import { FetcherKey, Middleware } from "./fetcher"


export const apiVersionMiddleware: <T> (
    _version?: string,
) => Middleware<T, T> =
    (version) =>
        async (key, options, next) => {
            const [url] = key

            const joinChar = url.includes("?") ? "&" : "?"
            const newKey: FetcherKey =
                [url + joinChar + "api-version=" + (version ?? API_VERSION)]
            return next(newKey, options)
        }

export const delayMiddleware: (
    _delayMs: number
) => Middleware<Response, Response> =
    (delayMs) =>
        async (key, options, next) => {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve(next(key, options))
                }, delayMs)
            })
        }

export const projectUrlMiddleware: <T> (
    _projectUrl: string | null
) => Middleware<T, T> =
    (projectUrl) =>
        (key, options, next) => {
            if (!projectUrl) {
                throw new Error(`${projectUrlMiddleware.name}: project URL is not set'`)
            }

            const [localUrl, ...rest] = key
            const fullUrl = `${projectUrl}/${localUrl}`
            const newKey: FetcherKey = [fullUrl, ...rest]
            return next(newKey, options)
        }

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
