
import useSWR, { KeyedMutator } from "swr"

import { baseUrlMiddleware, useBasicComposableFetcher, PULL_REQUESTS_URL, apiVersionMiddleware, patAuthMiddleware } from "@/network"
import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useOrgUrl } from "@/state/projectUrl"

import { pullRequestDtoResponseMiddleware } from "./pullRequestDtoResponseMiddleware"
import { PullRequestDto } from "./PullRequestDto"


export function useGetPullRequestsByProjectCall(projectUrl: string): {
    pullRequestsList: PullRequestDto[] | undefined
    error: Error | undefined
    isLoading: boolean
    isValidating: boolean
    mutate: KeyedMutator<PullRequestDto[]>
} {
    const orgUrl = useOrgUrl()
    const { patValue } = usePersonalAccessToken()

    const url = `${projectUrl}/${PULL_REQUESTS_URL}`

    const { data, error, isLoading, isValidating, mutate } =
        useSWR(
            ...useBasicComposableFetcher()
                .with(baseUrlMiddleware(orgUrl)).withKeyExtension(orgUrl)
                .with(apiVersionMiddleware())
                .with(patAuthMiddleware(patValue)).withKeyExtension(patValue)
                .with<PullRequestDto[]>(pullRequestDtoResponseMiddleware)
                .build(url),
        )

    return { pullRequestsList: data, error, isLoading, isValidating, mutate }
}