import { Middleware } from "@/network"


export const workItemsBatchRequestMiddleware: <T> (
    _workItems: number[]
) => Middleware<T, T> =
    (workItems) =>
        async (key, options, next) => {
            const payload = {
                ids: workItems,
                fields: [
                    "System.Title",
                ],
                errorPolicy: "omit", // not found ids will be ignored without any feedback
            }
            const augmentedOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(payload),
            }
            return next(key, augmentedOptions)
        }
