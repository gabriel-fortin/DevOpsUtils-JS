import { Middleware } from "@/network"


export const readWorkItemsTitlesMiddleware: (
    _expectedIds: number[]
) => Middleware<Response, string[]> =
    (expectedIds) =>
        async (key, options, next) => {
            const response = await next(key, options)
            const responseJson = await response.json() as WorkItemsTitlesResponseData
            const resultTitles = responseJson
                .value
                .map(x => x.fields["System.Title"])

            if (resultTitles.length !== expectedIds.length) {
                console.error(`Expected data for ${JSON.stringify(expectedIds.sort())} ` +
                    `but got them only for [${responseJson.value.map(x => x.id).sort()}]`)
            }

            return resultTitles
        }

type WorkItemsTitlesResponseData = {
    value: [
        {
            id: number,
            fields: {
                "System.Title": string
            }
        }
    ]
}
