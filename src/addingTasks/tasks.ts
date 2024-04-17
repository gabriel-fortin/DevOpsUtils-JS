
export type Task = {
    name: string,
    getTitle(): string,
}

export type SelectableTask =
    Task
    &
    {
        isSelected: boolean
    }

const allTasks: Task[] = [
    {
        name: "fill infosec",
        getTitle() { return this.name },
    },
    {
        name: "unit tests: user flow",
        getTitle() { return this.name },
    },
    {
        name: "unit tests: service",
        getTitle() { return this.name },
    },
]

export function createFreshTasksList(): SelectableTask[] {
    return allTasks.map(x => (
        {
            ...x,
            isSelected: false,
        }
    ))
}
