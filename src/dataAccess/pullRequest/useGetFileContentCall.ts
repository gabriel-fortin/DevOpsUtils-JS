import useSWR from "swr"

import { FetcherUrl, Middleware, REPOSITORIES_URL, useOrgLevelPreconfiguredComposableFetcher } from "@/network"


export function useGetFileContentCall(
    projectIdOrName: string | undefined,
    repositoryIdOrName: string | undefined,
    filePath: string | undefined,
    commitId: string | undefined,
): {
    content: string | undefined,
    error: Error | undefined,
    isLoading: boolean,
} {
    const url: FetcherUrl | null =
        (!projectIdOrName || !repositoryIdOrName || !filePath || !commitId) ? null
            : buildUrl(projectIdOrName, repositoryIdOrName, filePath, commitId)

    const { data, error, isLoading } =
        useSWR(
            ...useOrgLevelPreconfiguredComposableFetcher()
                .with(textResponseMiddleware)
                .build(url),
        )

    return { content: data, error, isLoading }
}

function buildUrl(
    projectIdOrName: string,
    repositoryIdOrName: string,
    filePath: string,
    commitId: string) {
    const params = [
        `path=${encodeURIComponent(filePath)}`,
        `versionDescriptor.version=${commitId}`,
        `versionDescriptor.versionType=commit`,
        `$format=text`,
    ].join("&")
    return `${projectIdOrName}/${REPOSITORIES_URL}/${repositoryIdOrName}/items?${params}`
}

const textResponseMiddleware: Middleware<Response, string> = async (key, options, next) => {
    const response = await next(key, options)
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText} \n`
            + (await response.text()).slice(0, 400))
    }
    return response.text()
}
