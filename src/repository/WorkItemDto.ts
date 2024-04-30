"use client"

import { WORK_ITEMS_URL } from "./constants"


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

export function extractWorkItemId(url: string): number | null {
    const index = url?.lastIndexOf(WORK_ITEMS_URL)
    if (index < 0) {
        console.warn(`Could not extract work item id from url: ${url}`)
    }
    const idChunk = url?.substring(index + WORK_ITEMS_URL.length)
    return Number(idChunk)
}
