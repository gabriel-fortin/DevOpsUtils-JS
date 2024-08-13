import useSWR from "swr"

import { useProjectUrl } from "@/contexts/ProjectUrlContext"
import { useNoAuthPreconfiguredComposableFetcher } from "@/networking/preconfiguredFetchers"
import { TAGS_URL } from "@/networking/constants"
import { FetcherKey } from "@/networking/fetcher"

import { patAuthMiddleware } from "./middleware"

/**
 * Unspecified call to DevOps to check the validity of the PAT
 */
export function useAnyCallUsingPat(pat: string) {
    const [projectUrl] = useProjectUrl()
    const key: FetcherKey = [`${TAGS_URL}`]
    // if there's no PAT then there's no point in making a request
    // using null tells SWR to not make a request
    const actualKey = pat ? key : null
    return useSWR(
        actualKey,
        useNoAuthPreconfiguredComposableFetcher()
            .with<Response>(patAuthMiddleware(pat))
            .build(),
    )
    // return useSWR(
    //     [actualKey, projectUrl],
    //     useNoAuthPreconfiguredComposableFetcher()
    //         .with<Response>(patAuthMiddleware(pat))
    //         .build(),
    // )
}
