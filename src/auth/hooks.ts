import useSWR from "swr"

import { useNoAuthPreconfiguredComposableFetcher } from "@/niceties"
import { TAGS_URL } from "@/repository/constants"
import { FetcherKey } from "@/repository/fetcher"

import { patAuthMiddleware } from "./middleware"

/**
 * Unspecified call to DevOps to check the validity of the PAT
 */
export function useAnyCallUsingPat(pat: string) {
    const key: FetcherKey = [`${TAGS_URL}`]
    // if there's no PAT then there's no point in making a request
    // using null tells SWR to not make a request
    const actualKey = pat ? key : null
    return useSWR(
        actualKey,
        useNoAuthPreconfiguredComposableFetcher()
            .with(patAuthMiddleware(pat))
            .build(),
    )
}
