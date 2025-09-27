import { API_VERSION } from "./constants"
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

export const baseUrlMiddleware: <T> (
    _baseUrl: string | null
) => Middleware<T, T> =
    (baseUrl) =>
        (key, options, next) => {
            if (!baseUrl) {
                throw new Error(`${baseUrlMiddleware.name}: base/project URL is not set'`)
            }

            const [localUrl, ...rest] = key
            const fullUrl = `${baseUrl}/${localUrl}`
            const newKey: FetcherKey = [fullUrl, ...rest]
            return next(newKey, options)
        }

export const patAuthMiddleware: (
    _pat: string
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
