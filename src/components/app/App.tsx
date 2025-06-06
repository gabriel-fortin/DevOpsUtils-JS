import reactLogo from "/react.svg"
import viteLogo from "/vite.svg"

import { AddTasks } from "@/components/addingTasks"
import { PatAuth } from "@/components/auth"
import { SelectProjectUrl } from "@/components/selectProjectUrl"
import { SelectWorkItem } from "@/components/selectWorkItem"
import { WorkItemAndItsChildren } from "@/components/showWorkItems"
import { PersonalAccessTokenContextProvider, usePersonalAccessToken } from "@/state/personalAccesssToken"
import { ProjectUrlContextProvider, useProjectUrl } from "@/state/projectUrl"
import { IfWorkItemIdIsSet, useWorkItemId, WorkItemIdContextProvider } from "@/state/workItemId"

import "./App.css"


export default function App() {
  return (
    <ProjectUrlContextProvider>
      <PersonalAccessTokenContextProvider>
        <WorkItemIdContextProvider>
          <main className="main">
            <h1>A tool for chores in DevOps projects</h1>
            <SelectProjectCard />
            <PatAuthCard />
            <div className="flex gap-8">
              <div className="grow flex flex-col gap-8 max-w-[30em]">
                <SelectWorkItemCard />
                <AddTasksCard />
              </div>
              <div className="grow">
                <WorkItemAndItsChildrenCard />
              </div>
            </div>
          </main>
          <Logos />
        </WorkItemIdContextProvider>
      </PersonalAccessTokenContextProvider>
    </ProjectUrlContextProvider>
  )
}

const SelectProjectCard: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()

    const requiresAttention = !projectUrl

    return (
      <Card isHighlighted={requiresAttention}>
        <SelectProjectUrl />
      </Card>
    )
  }

const PatAuthCard: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()
    const { patValue } = usePersonalAccessToken()

    const requiresAttention = !!projectUrl && !patValue

    return (
      <Card isHighlighted={requiresAttention}>
        <PatAuth requiresAttention={requiresAttention} />
      </Card>
    )
  }

const SelectWorkItemCard: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()
    const { patValue } = usePersonalAccessToken()
    const { workItemId } = useWorkItemId()

    const requiresAttention = !!projectUrl && !!patValue && !workItemId

    return (
      <Card isHighlighted={requiresAttention}>
        <SelectWorkItem requiresAttention={requiresAttention} />
      </Card>
    )
  }

const AddTasksCard: React.FC =
  () => {
    return (
      <IfWorkItemIdIsSet>
        <Card>
          <div className="-my-3">
            <AddTasks />
          </div>
        </Card>
      </IfWorkItemIdIsSet>
    )
  }

const WorkItemAndItsChildrenCard: React.FC =
  () => {
    return (
      <IfWorkItemIdIsSet>
        <Card>
          <WorkItemAndItsChildren />
        </Card>
      </IfWorkItemIdIsSet>
    )
  }

const Card: React.FC<{
  children?: React.ReactNode
  render?: React.ReactNode
  isHighlighted?: boolean
}> = ({
  children,
  render: childrenToRender,
  isHighlighted = false,
}) => {
    return (
      <div className={`card p-4 m-1 ${isHighlighted ? "border-1 border-accent" : "border-2 border-primary"}`}>
        {childrenToRender}
        {children}
        {isHighlighted && <span className="absolute left-0.5 top-4 bottom-4 rounded-sm bg-accent w-0.5 animate-pulse"></span>}
      </div>
    )
  }

const Logos: React.FC = () => {
  return (
    <div className="flex gap-5 mx-8 my-6">
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
  )
}