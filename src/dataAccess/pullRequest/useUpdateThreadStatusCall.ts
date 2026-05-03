import useSWRMutation from "swr/mutation"

import { FetcherUrl, usePreconfiguredComposableFetcher, REPOSITORIES_URL } from "@/network"

import { useGetPrThreadsCall } from "./useGetPrThreadsCall"


export function useUpdateThreadStatusCall(
    projectName: string | undefined,
    repositoryName: string | undefined,
    pullRequestId: number | undefined,
    threadId: number,
) {
    const url: FetcherUrl | null =
        (!repositoryName || !pullRequestId) ? null
            : `${REPOSITORIES_URL}/${repositoryName}/pullRequests/${pullRequestId}/threads/${threadId}`

    const { data, error, trigger, reset, isMutating } =
        useSWRMutation(
            ...usePreconfiguredComposableFetcher()
                .buildForMutation(url, payloadBuilder)
        )

    // after updating the thread status, the thread list will be out of date
    // it needs refreshing
    const { mutate: refreshThreads } = useGetPrThreadsCall(
        projectName,
        repositoryName,
        pullRequestId,
    )
    const triggerAndRefresh: (_newStatus: string) => ReturnType<typeof trigger> =
        async (newStatus) => {
            const result = await trigger(newStatus)
            refreshThreads()
            return result
        }

    return { data, error, trigger: triggerAndRefresh, reset, isMutating }
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