import useSWR, { KeyedMutator } from "swr"

import { baseUrlMiddleware, FetcherUrl, useBasicComposableFetcher, PROJECTS_URL, apiVersionMiddleware, patAuthMiddleware } from "@/network"
import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useOrgUrl } from "@/state/projectUrl"

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
    const orgUrl = useOrgUrl()

    const url: FetcherUrl | null = (orgUrl === null) ? null : PROJECTS_URL

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
