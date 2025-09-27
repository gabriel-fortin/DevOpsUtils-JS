import { Middleware } from "@/network"

import { ProjectDto } from "./ProjectDto"


export const projectsDtoResponseMiddleware: Middleware<Response, ProjectDto[]>
    = async (key, options, next) => {
        const response = await next(key, options)
        const payload = await response.json() as Payload
        return payload.value
    }

type Payload = {
    count: number,
    value: ProjectDto[]
}