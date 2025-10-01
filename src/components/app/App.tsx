import reactLogo from "/react.svg"
import viteLogo from "/vite.svg"

import { PersonalAccessTokenContextProvider } from "@/state/personalAccesssToken"
import { ProjectUrlContextProvider } from "@/state/projectUrl"
import { WorkItemIdContextProvider } from "@/state/workItemId"

import { TabContainer } from "./helpers/tabs"
import { ProjectAndAuthTab } from "./tabSections/ProjectAndAuthTab"
import { WorkItemTab } from "./tabSections/WorkItemTab"
import { PullRequestsTab } from "./tabSections/PullRequestsTab"
import "./App.css"


export default function App() {
  return (
    <ProjectUrlContextProvider>
      <PersonalAccessTokenContextProvider>
        <WorkItemIdContextProvider>
          <MainUi />
          <Logos />
        </WorkItemIdContextProvider>
      </PersonalAccessTokenContextProvider>
    </ProjectUrlContextProvider>
  )
}

const MainUi: React.FC = () => {
  return (
    <main className="main -m-1.5 md:p-6 lg:p-12">
      <h1 className="px-6 md:p-0">A tool for chores in DevOps projects</h1>
      <TabContainer>
        <ProjectAndAuthTab />
        <WorkItemTab />
        <PullRequestsTab />
      </TabContainer>
    </main>)
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