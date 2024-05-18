
export type Task = {
    name: string,
    getTitle(): string,
    group: "special" | "Presentation" | "Access"
}

const allTasks: Task[] = [
    {
        name: "fill infosec",
        getTitle() { return this.name },
        group: "special",
    },
    {
        name: "add functions to SQL script",
        getTitle() { return this.name },
        group: "special",
    },
    {
        name: "update ServiceUrls in the Relay",
        getTitle() { return this.name },
        group: "special",
    },
    {
        name: "implement web API",
        getTitle() { return this.name },
        group: "Access",
    },
    {
        name: "validate CRM payloads",
        getTitle() { return this.name },
        group: "Access",
    },
    {
        name: "ensure web API is secure",
        getTitle() { return this.name },
        group: "Access",
    },
    {
        name: "implement front-end",
        getTitle() { return this.name },
        group: "Presentation",
    },
    {
        name: "ensure front-end is accessible",
        getTitle() { return this.name },
        group: "Presentation",
    },
    {
        name: "validate user inputs",
        getTitle() { return this.name },
        group: "Presentation",
    },
    {
        name: "unit tests for user flow",
        getTitle() { return this.name },
        group: "Presentation",
    },
    {
        name: "unit tests for service",
        getTitle() { return this.name },
        group: "Access",
    },
]

export function createFreshTasksList(): Task[] {
    return allTasks
}
