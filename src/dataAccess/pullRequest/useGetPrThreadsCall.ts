import useSWR, { KeyedMutator } from "swr"

import { FetcherUrl, REPOSITORIES_URL, useOrgLevelPreconfiguredComposableFetcher } from "@/network"

import { ThreadDto } from "./ThreadDto"
import { threadDtoResponseMiddleware } from "./threadDtoResponseMiddleware"


export function useGetPrThreadsCall(
    projectIdOrName: string | undefined,
    repositoryIdOrName: string | undefined,
    pullRequestIdOrName: number | undefined,
): {
    threads: ThreadDto[] | undefined,
    error: Error | undefined,
    isLoading: boolean,
    isValidating: boolean,
    mutate: KeyedMutator<ThreadDto[]>
} {
    const url: FetcherUrl | null =
        (!projectIdOrName || !repositoryIdOrName || !pullRequestIdOrName) ? null
            : `${projectIdOrName}/${REPOSITORIES_URL}/${repositoryIdOrName}/pullRequests/${pullRequestIdOrName}/threads`

    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...useOrgLevelPreconfiguredComposableFetcher()
                .with<ThreadDto[]>(threadDtoResponseMiddleware)
                .build(url),
        )
    if (error) console.log(`ERROR in useGetPrThreadsCall(${repositoryIdOrName}, ${pullRequestIdOrName})`, error)
    return { threads: data, error, isLoading, isValidating, mutate }
}