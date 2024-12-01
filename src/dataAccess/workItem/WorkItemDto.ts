"use client"

import { WORK_ITEMS_URL } from "@/network"


export type WorkItemDto = {
    id: string
    rev: number
    url: string
    fields: {
        "System.Title": string
    }
    relations?: [{
        rel: string
        url: string
        attributes: [any]
    }]
    _links: {
        self: { href: string }
        workItemType: { href: string }
    }
}

export function extractWorkItemId(url?: string): number | null {
    const index = url?.lastIndexOf(WORK_ITEMS_URL) ?? -2
    if (index < 0) {
        console.warn(`Could not extract (index=${index}) work item id from url: ${url}`)
    }
    const idChunk = url?.substring(index + WORK_ITEMS_URL.length + 1)
    return Number(idChunk)
}

export function getParentId(workItemDto?: WorkItemDto): number | null {
    const parentUrl = workItemDto
        ?.relations
        ?.find(x => x.rel === "System.LinkTypes.Hierarchy-Reverse")
        ?.url

    if (!parentUrl) return null
    return extractWorkItemId(parentUrl)
}

export function getChildrenIds(workItemDto?: WorkItemDto): number[] {
    const maybeIds: (number | null)[] | undefined =
        workItemDto
            ?.relations
            ?.filter(x => x.rel === "System.LinkTypes.Hierarchy-Forward")
            .map(x => extractWorkItemId(x.url))
    return omitFalsyValues(maybeIds ?? [])
}

function omitFalsyValues<T>(arg: (T | null | undefined)[]): T[] {
    return arg.filter(x => !!x) as T[]
}