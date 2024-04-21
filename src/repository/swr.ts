import useSWR from "swr"

import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"
import { API_VERSION, BASE_URL } from "@/constants"

import { WorkItemDto } from "./WorkItemDto"


type FetcherKey = [string, string]

async function authenticatingFetcher([localUrl, pat]: FetcherKey): Promise<Response> {

    console.log("🚀 ~ fetcher:", `'${localUrl}', pat: ${pat}`)

    const options: RequestInit = {
        headers: {
            "Accept": "application/json",
            "Authorization": `Basic ${btoa(":" + pat)}`,
        }
    }
    const joinChar = localUrl.includes("?") ? "&" : "?"
    return await fetch(BASE_URL + localUrl + joinChar + API_VERSION, options)
}

function extractWorkItemFromResponse(someFetcher: (k: FetcherKey) => Promise<Response>): (args: any) => Promise<WorkItemDto> {
    return async function (args: Parameters<typeof someFetcher>): Promise<WorkItemDto> {
        const response = await someFetcher(...args)
        return (await response.json()) as WorkItemDto
    }
}

export function useFetchWorkItem(workItemId: number, patOverride?: string) {
    const { data, error, isLoading, isValidating, mutate } = useDevOpsApiInternal(
        `wit/workitems/${workItemId}?$expand=Relations`,
        extractWorkItemFromResponse(authenticatingFetcher),
        patOverride,
    )
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}

export function useDevOpsApi(localUrl: string, patOverride?: string) {
    return useDevOpsApiInternal(localUrl, authenticatingFetcher, patOverride)
}

function useDevOpsApiInternal<TFetcherReturn>(localUrl: string, fetcher: (k: FetcherKey) => Promise<TFetcherReturn>, patOverride?: string) {
    const pat = usePersonalAccessToken()
    const key: FetcherKey = [localUrl, patOverride ?? pat]
    return useSWR(key, fetcher)
}
