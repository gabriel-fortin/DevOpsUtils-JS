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
import { useState } from "react"


export default function App() {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <ProjectUrlContextProvider>
      <PersonalAccessTokenContextProvider>
        <WorkItemIdContextProvider>
          <main className="main">
            <h1>A tool for chores in DevOps projects</h1>
            <div role="tablist" className="tabs tabs-lift">
              <ProjectAndAuthTab isCurrent={currentTab === 0} onClick={() => setCurrentTab(0)} />
              <WorkItemTab isCurrent={currentTab === 1} onClick={() => setCurrentTab(1)} />
              <PullRequestsTab isCurrent={currentTab === 2} onClick={() => setCurrentTab(2)} />
            </div>
          </main>
          <Logos />
        </WorkItemIdContextProvider>
      </PersonalAccessTokenContextProvider>
    </ProjectUrlContextProvider>
  )
}

const ProjectAndAuthTab: React.FC<{
  isCurrent?: boolean
  onClick?: () => void
}> = ({
  isCurrent,
  onClick,
}) => {
    const { projectUrl } = useProjectUrl()
    const { patValue } = usePersonalAccessToken()
    const tab1RequiresAttention = !isCurrent && (!projectUrl || !patValue)

    return (
      <Tab label="Project & auth" isCurrent={isCurrent} onClick={onClick} hasDot={tab1RequiresAttention}>
        <div className=" flex flex-col gap-5">
          <SelectProjectCard />
          <PatAuthCard />
        </div>
      </Tab>
    )
  }

const WorkItemTab: React.FC<{
  isCurrent?: boolean
  onClick?: () => void
}> = ({
  isCurrent,
  onClick,
}) => {
    return (
      <Tab label="Work item" isCurrent={isCurrent} onClick={onClick}>
        <div className="flex gap-8">
          <div className="grow flex flex-col gap-8 max-w-[30em]">
            <SelectWorkItemCard />
            <AddTasksCard />
          </div>
          <div className="grow">
            <WorkItemAndItsChildrenCard />
          </div>
        </div>
      </Tab>
    )
  }

const PullRequestsTab: React.FC<{
  isCurrent?: boolean
  onClick?: () => void
}> = ({
  isCurrent,
  onClick,
}) => {
    return (
      <Tab label="Pull requests" isCurrent={isCurrent} onClick={onClick}>
        Some summary of active pull requests. Maybe grouped by project. Maybe by date.
        Maybe untouched ones will be displayed first.
      </Tab>
    )
  }

const Tab: React.FC<{
  label: string
  isCurrent?: boolean
  onClick?: () => void
  hasDot?: boolean
  children?: React.ReactNode
}> = ({
  label,
  isCurrent,
  onClick,
  hasDot,
  children,
}) => {
    const css = isCurrent ? "tab-active" : ""
    return (
      <>
        <span role="tab" className={`tab indicator ${css}`} onClick={onClick}>
          {hasDot &&
            <span className="mt-1 indicator-item indicator-center status status-accent status-lg animate-pulse font-bold" />
          }
          <span className="">
            {label}
          </span>
        </span>
        <div className="tab-content p-3 bg-base-100 border-(--color-base-300)">
          {children}
        </div>
      </>
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
      <div className={`card p-4 m-1 ${isHighlighted ? "border border-accent" : "border-3 border-primary"}`}>
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