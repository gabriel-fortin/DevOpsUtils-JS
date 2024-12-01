export type Task = {
    getTitle(): string
    group: "special" | "Presentation" | "System Portal"
    allKnownTitles: string[]
}
