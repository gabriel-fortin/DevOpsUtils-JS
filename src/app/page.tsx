"use client"

import React from "react"
import Image from "next/image"
import { useIsClient } from "@uidotdev/usehooks"

import { AddTasks } from "@/addingTasks/AddTasks"
import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContextProvider } from "@/contexts/PersonalAccessTokenContext"
import { ProjectUrlContextProvider, SetConstantProjectUrl } from "@/contexts/ProjectUrlContext"
import { IfWorkItemIdIsSet, WorkItemIdContextProvider } from "@/contexts/WorkItemIdContext"
import { SelectProjectUrl } from "@/projectUrl/SelectProjectUrl"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"

import styles from "./page.module.css"


export default function MyMainPage() {
  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <ProjectUrlContextProvider>
      <PersonalAccessTokenContextProvider>
        <WorkItemIdContextProvider>
          <main className={styles.main}>
            <h1>A tool for chores in DevOps projects</h1>
            <Card>
              <SelectProjectUrl />
            </Card>
            <Card>
              <PatAuth />
            </Card>
            <Card>
              <SelectWorkItem />
            </Card>
            <IfWorkItemIdIsSet>
              <Card>
                <WorkItemAndItsChildren />
              </Card>
              <Card>
                <AddTasks />
              </Card>
            </IfWorkItemIdIsSet>
          </main>
        </WorkItemIdContextProvider>
      </PersonalAccessTokenContextProvider>
    </ProjectUrlContextProvider>
  )
}

const Card: React.FC<{
  children: React.ReactNode
}> = ({
  children,
}) => {
    return (
      <div className={styles.card}>
        {children}
      </div>
    )
  }
