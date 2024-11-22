export type Task = {
    name: string,
    getTitle(): string,
    group: "special" | "Presentation" | "Access"
}
