import useSWR from "swr"

import { PROJECT_URL } from "@/config"
import { TAGS_URL } from "@/repository/constants"
import { FetcherKey, useComposableFetcher } from "@/repository/fetcher"
import { apiVersionMiddleware, projectUrlMiddleware } from "@/repository/middleware"

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
        useComposableFetcher()
            .with(projectUrlMiddleware(PROJECT_URL))
            .with(apiVersionMiddleware())
            .with(patAuthMiddleware(pat))
            .build(),
    )
}
