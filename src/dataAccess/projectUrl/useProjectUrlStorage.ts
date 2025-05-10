import { useLocalStorage } from "@uidotdev/usehooks"


type RepoModel = {
    projectList: string[]
    addProject: (_url: string) => void
    removeProject: (_url: string) => void
}

export function useProjectUrlStorage(): RepoModel {
    const [projectList, setProjectList] = useLocalStorage<string[]>("project URL list", [])

    const addProject: RepoModel["addProject"] =
        url => setProjectList(oldList => [...oldList, url])

    const removeProject: RepoModel["removeProject"] =
        url => setProjectList(oldList => oldList.filter(x => x !== url))

    return { projectList, addProject, removeProject }
}
