import { Middleware } from "@/network"


export const statusResponseErrorsMiddleware: Middleware<Response, null>
    = async (key, options, next) => {
        const response = await next(key, options)

        if (response.status === 200) return null

        const errors = [] as string[]

        if (response.status === 404) {
            errors.push("Not found. Does the repository exist in the selected project?")
        } else {
            errors.push(`Unexpected response status: ${response.status} ${response.statusText}`)
        }

        const payload = await response.json()
        errors.push(`DevOps message: ${payload.message}`)

        throw errors
    }
