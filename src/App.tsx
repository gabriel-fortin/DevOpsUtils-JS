import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"

import { AddTasks } from "@/addingTasks"
import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContextProvider, usePersonalAccessTokenValue } from "@/contexts/PersonalAccessTokenContext"
import { ProjectUrlContextProvider, useProjectUrl, SelectProjectUrl } from "@/projectUrl"
import { IfWorkItemIdIsSet, WorkItemIdContextProvider } from "@/contexts/WorkItemIdContext"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"

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
            <Card render={<SelectWorkItem />} />
            <IfWorkItemIdIsSet>
              <Card render={<WorkItemAndItsChildren />} />
              <Card render={<AddTasks />} />
            </IfWorkItemIdIsSet>
          </main>
          <Logos />
        </WorkItemIdContextProvider>
      </PersonalAccessTokenContextProvider>
    </ProjectUrlContextProvider>
  )
}

const SelectProjectCard: React.FC =
  (
  ) => {
    const { projectUrl } = useProjectUrl()
    return (
      <Card isHighlighted={!projectUrl}>
        <SelectProjectUrl />
      </Card>
    )
  }

const PatAuthCard: React.FC =
  (
  ) => {
    const { projectUrl } = useProjectUrl()
    const pat = usePersonalAccessTokenValue()

    return (
      <Card isHighlighted={!!projectUrl && !pat}>
        <PatAuth />
      </Card>
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