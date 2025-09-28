import { Middleware } from "@/network"

import { PullRequestDto } from "./PullRequestDto"


export const pullRequestDtoResponseMiddleware: Middleware<Response, PullRequestDto[]>
    = async (key, options, next) => {
        const response = await next(key, options)
        const payload = await response.json() as Payload
        return payload.value
    }

type Payload = {
    count: number,
    value: PullRequestDto[]
}