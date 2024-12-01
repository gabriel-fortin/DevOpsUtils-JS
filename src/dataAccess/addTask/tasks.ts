import { Task } from "./Task"


const allTasks: Task[] = [
    {
        group: "special",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Fill infosec"],
    },
    {
        group: "special",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: [
            "Add SQL functions and Relay endpoints",
            "add functions to SQL script",
        ],
    },
    {
        group: "special",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Preserve example payloads"],
    },
    {
        group: "special",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["End-to-end smoke test"],
    },
    {
        group: "System Portal",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Implement web API"],
    },
    {
        group: "System Portal",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Validate CRM payloads"],
    },
    {
        group: "System Portal",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Ensure web API is secure"],
    },
    {
        group: "System Portal",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Validate TaxLive payloads"],
    },
    {
        group: "System Portal",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Unit tests for service"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Model, action method stub"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["View"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["User flow, repository"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Ensure front-end is accessible"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Validate user inputs"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Unit tests for user flow"],
    },
    {
        group: "Presentation",
        getTitle() { return this.allKnownTitles[0] },
        allKnownTitles: ["Put correct enrolment levels against action methods"],
    },
]

export function createFreshTasksList(): Task[] {
    return allTasks
}
