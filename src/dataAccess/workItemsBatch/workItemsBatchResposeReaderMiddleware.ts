import { Middleware } from "@/network"

import { WorkItemDto } from "@/dataAccess/workItem"


export const workItemsBatchResposeReaderMiddleware: (
    _expectedIds: number[]
) => Middleware<Response, WorkItemDto[]> =
    (expectedIds) =>
        async (key, options, next) => {
            const response = await next(key, options)
            const responseJson = await response.json() as WorkItemsResponseData

            if (responseJson.value.length !== expectedIds.length) {
                console.error(`Expected data for ${JSON.stringify(expectedIds.sort())} ` +
                    `but got them only for [${responseJson.value.map(x => x.id).sort()}]`)
            }

            return responseJson.value
        }

type WorkItemsResponseData = {
    value: WorkItemDto[],
}
