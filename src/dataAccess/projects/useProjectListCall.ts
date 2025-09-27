import useSWR, { KeyedMutator } from "swr"

import { baseUrlMiddleware, FetcherUrl, useBasicComposableFetcher, PROJECTS_URL, apiVersionMiddleware, patAuthMiddleware } from "@/network"
import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useProjectUrl } from "@/state/projectUrl"

import { projectsDtoResponseMiddleware } from "./projectsDtoResponseMiddleware"
import { ProjectDto } from "./ProjectDto"


export function useProjectListCall(): {
    projectsList: ProjectDto[] | undefined
    error: Error | undefined
    isLoading: boolean
    isValidating: boolean
    mutate: KeyedMutator<ProjectDto[]>
} {
    const { patValue } = usePersonalAccessToken()
    let { projectUrl } = useProjectUrl()
    
    let orgUrl = null
    if (projectUrl) {
        projectUrl = projectUrl?.endsWith("/") ? projectUrl.slice(0, -1) : projectUrl
        orgUrl = projectUrl.substring(0, projectUrl.lastIndexOf("/"))
    }

    const url: FetcherUrl | null = (projectUrl === null) ? null : PROJECTS_URL

    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...useBasicComposableFetcher()
                .with(baseUrlMiddleware(orgUrl)).withKeyExtension(orgUrl)
                .with(apiVersionMiddleware())
                .with(patAuthMiddleware(patValue)).withKeyExtension(patValue)
                .with(projectsDtoResponseMiddleware)
                .build(url),
        )

    return { projectsList: data, error, isLoading, isValidating, mutate }
}
