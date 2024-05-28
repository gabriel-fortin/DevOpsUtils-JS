import { patAuthMiddleware } from "@/auth/middleware"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"
import { WORK_ITEMS_URL } from "@/repository/constants"
import { composableFetcher } from "@/repository/fetcher"
import { useDevOpsApi2 } from "@/repository/hooks"

import { workItemDtoResponseMiddleware } from "./middleware"


export function useFetchWorkItem(
    workItemId: number,
) {
    const pat = usePersonalAccessToken()
    const { data, error, isLoading, isValidating, mutate } =
        useDevOpsApi2(
            `${WORK_ITEMS_URL}/${workItemId}?$expand=Relations`,
            composableFetcher
                .with(patAuthMiddleware(pat))
                .with(workItemDtoResponseMiddleware)
                .build(),
        )
    if (error) console.log("ERROR", error)
    return { workItemDto: data, error, isLoading, isValidating, mutate }
}
