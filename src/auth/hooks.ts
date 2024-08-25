import useSWR from "swr"

import { useNoAuthPreconfiguredComposableFetcher } from "@/networking/preconfiguredFetchers"
import { TAGS_URL } from "@/networking/constants"
import { FetcherUrl } from "@/networking/fetcher"

import { patAuthMiddleware } from "./middleware"

/**
 * Unspecified call to DevOps to check the validity of the PAT
 */
export function useAnyCallUsingPat(pat: string) {
    const url: FetcherUrl = `${TAGS_URL}`
    // if there's no PAT then there's no point in making a request
    // using null tells SWR to not make a request
    const actualUrl = pat ? url : null

    return useSWR(
        ...useNoAuthPreconfiguredComposableFetcher()
            .with<Response>(patAuthMiddleware(pat), pat)
            .build(actualUrl)
    )
}
