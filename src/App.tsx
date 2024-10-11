import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"

import { AddTasks } from "@/addingTasks"
import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContextProvider } from "@/contexts/PersonalAccessTokenContext"
import { ProjectUrlContextProvider } from "@/contexts/ProjectUrlContext"
import { IfWorkItemIdIsSet, WorkItemIdContextProvider } from "@/contexts/WorkItemIdContext"
import { SelectProjectUrl } from "@/projectUrl/SelectProjectUrl"
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
            <Card render={<SelectProjectUrl />} />
            <Card render={<PatAuth />} />
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

const Card: React.FC<{
  children?: React.ReactNode
  render?: React.ReactNode
}> = ({
  children,
  render: childrenToRender
}) => {
    return (
      <div className="card">
        {childrenToRender}
        {children}
      </div>
    )
  }

const Logos: React.FC = () => {
  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
  )
}