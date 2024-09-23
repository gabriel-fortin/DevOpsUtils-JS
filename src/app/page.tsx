"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useIsClient } from "@uidotdev/usehooks"

import { AddTasks } from "@/addingTasks/AddTasks"
import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContextProvider } from "@/contexts/PersonalAccessTokenContext"
import { ProjectUrlContextProvider, SetConstantProjectUrl } from "@/contexts/ProjectUrlContext"
import { WorkItemIdContext } from "@/contexts/WorkItemIdContext"
import { SelectProjectUrl } from "@/projectUrl/SelectProjectUrl"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"

import styles from "./page.module.css"


export default function MyMainPage() {
  const [workItemId, setWorkItemId] = useState<number | null>(null)

  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <ProjectUrlContextProvider>
      <PersonalAccessTokenContextProvider>
        <WorkItemIdContext.Provider value={{ workItemId }}>
          <main className={styles.main}>
            <h1>A tool for chores in DevOps projects</h1>
            <Card>
              <SelectProjectUrl />
            </Card>
            <Card>
              <PatAuth />
            </Card>
            <Card>
              <SelectWorkItem onWorkItemSelected={setWorkItemId} />
            </Card>
            <Card hideIf={!workItemId}>
              <WorkItemAndItsChildren />
            </Card>
            <Card hideIf={!workItemId}>
              <AddTasks />
            </Card>
          </main>
        </WorkItemIdContext.Provider>
      </PersonalAccessTokenContextProvider>
    </ProjectUrlContextProvider>
  )
}

const Card: React.FC<{
  hideIf?: boolean
  children: React.ReactNode
}> = ({
  hideIf: shouldHideCard,
  children,
}) => {
    if (shouldHideCard) return null

    return (
      <div className={styles.card}>
        {children}
      </div>
    )
  }
