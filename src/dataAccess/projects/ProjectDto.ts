export type ProjectDto = {
    id: string
    revision: number
    url: string
    name: string
    description: string
    state: "wellFormed" | "deleting" | "deleted" | "new" | "createPending" | "all" | "unchanged"
    visibility: "private" | "public"
    lastUpdateTime: string // ISO 8601 timestamp
}