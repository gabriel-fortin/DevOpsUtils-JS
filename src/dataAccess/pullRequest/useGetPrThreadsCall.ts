import useSWR, { KeyedMutator } from "swr"

import { apiVersionMiddleware, baseUrlMiddleware, FetcherUrl, patAuthMiddleware, REPOSITORIES_URL, useBasicComposableFetcher } from "@/network"
import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useOrgUrl } from "@/state/projectUrl"

import { ThreadDto } from "./ThreadDto"
import { threadDtoResponseMiddleware } from "./threadDtoResponseMiddleware"


export function useGetPrThreadsCall(
    projectIdOrName: string | undefined,
    repositoryIdOrName: string | undefined,
    pullRequestIdOrName: number | undefined,
): {
    threads: ThreadDto[] | undefined,
    error: Error,
    isLoading: boolean,
    isValidating: boolean,
    mutate: KeyedMutator<ThreadDto[]>
} {
    const orgUrl = useOrgUrl()
    const { patValue } = usePersonalAccessToken()

    const url: FetcherUrl | null =
        (!projectIdOrName || !repositoryIdOrName || !pullRequestIdOrName) ? null
            : `${projectIdOrName}/${REPOSITORIES_URL}/${repositoryIdOrName}/pullRequests/${pullRequestIdOrName}/threads`

    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...useBasicComposableFetcher()
                .with(baseUrlMiddleware(orgUrl)).withKeyExtension(orgUrl)
                .with(apiVersionMiddleware())
                .with(patAuthMiddleware(patValue)).withKeyExtension(patValue)
                .with<ThreadDto[]>(threadDtoResponseMiddleware)
                .build(url),
        )
    if (error) console.log(`ERROR in useGetPrThreadsCall(${repositoryIdOrName}, ${pullRequestIdOrName})`, error)
    return { threads: data, error, isLoading, isValidating, mutate }
}