import { Middleware } from "@/network"

import { ThreadDto } from "./ThreadDto"


export const threadDtoResponseMiddleware: Middleware<Response, ThreadDto[]>
    = async (key, options, next) => {
        const response = await next(key, options)
        const payload = await response.json() as Payload
        return payload.value
    }

type Payload = {
    count: number,
    value: ThreadDto[]
}