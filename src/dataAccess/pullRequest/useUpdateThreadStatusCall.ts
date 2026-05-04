import useSWRMutation, { SWRMutationResponse } from "swr/mutation"

import { FetcherUrl, FetcherKey, usePreconfiguredComposableFetcher, REPOSITORIES_URL } from "@/network"

import { useGetPrThreadsCall } from "./useGetPrThreadsCall"
import { statusResponseErrorsMiddleware } from "./statusResponseErrorsMiddleware"


export function useUpdateThreadStatusCall(
    projectName: string | undefined,
    repositoryName: string | undefined,
    pullRequestId: number | undefined,
    threadId: number,
): SWRMutationResponse<null, string[] | Error, FetcherKey, string> {
    const url: FetcherUrl | null =
        (!repositoryName || !pullRequestId) ? null
            : `${REPOSITORIES_URL}/${repositoryName}/pullRequests/${pullRequestId}/threads/${threadId}`

    const { data: _, error, trigger, reset, isMutating } =
        useSWRMutation(
            ...usePreconfiguredComposableFetcher()
                .with(statusResponseErrorsMiddleware)
                .buildForMutation(url, payloadBuilder)
        )

    // after updating the thread status, the thread list will be out of date
    // it needs refreshing
    const { mutate: refreshThreads } = useGetPrThreadsCall(
        projectName,
        repositoryName,
        pullRequestId,
    )
    const triggerAndRefresh: (_newStatus: string) => Promise<null> =
        async (newStatus) => {
            const result = await trigger(newStatus)
            refreshThreads()
            return result
        }


    return {
        data: undefined,
        error,
        trigger: triggerAndRefresh,
        reset,
        isMutating
    }
}

function payloadBuilder(newStatus: string): RequestInit {
    return {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
    }
}
