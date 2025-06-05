import useSWR from "swr"

import { patAuthMiddleware, useNoAuthPreconfiguredComposableFetcher, TAGS_URL, FetcherUrl } from "@/network"


/**
 * Unspecified call to DevOps to check the validity of the PAT
 */
export function useAnythingUsingPatCall(pat: string) {
    const url: FetcherUrl = `${TAGS_URL}`
    // if there's no PAT then there's no point in making a request
    // using null tells SWR to not make a request
    const actualUrl = pat ? url : null

    return useSWR(
        ...useNoAuthPreconfiguredComposableFetcher()
            .with<Response>(patAuthMiddleware(pat)).withKeyExtension(pat)
            .build(actualUrl)
    )
}
