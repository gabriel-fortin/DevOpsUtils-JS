"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import { useIsClient } from "@uidotdev/usehooks"

import { AddTasks } from "@/addingTasks/AddTasks"
import { PatAuth } from "@/auth/PatAuth"
import { BASE_URL } from "@/constants"
import { PersonalAccessTokenContext } from "@/contexts/PersonalAccessTokenContext"
import { WorkItemIdContext } from "@/contexts/WorkItemIdContext"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"
import { FetchWorkItem } from "@/showWorkItems/FetchWorkItem"

import styles from "./page.module.css"


export default function MyMainPage() {
  const [pat, setPat] = useState("")
  const [workItemId, setWorkItemId] = useState<number | null>(null)

  const url = useMemo(() =>
    `${BASE_URL}/wit/workitems/${workItemId}?$expand=Relations`,
    [workItemId])

  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <main className={styles.main}>
      <h1>A tool for chores in DevOps projects</h1>
      <div className={styles.card}>
        <PatAuth onPatChange={setPat} />
      </div>
      <div className={styles.card}>
        <SelectWorkItem onWorkItemSelected={setWorkItemId} />
      </div>
      <PersonalAccessTokenContext.Provider value={pat}>
        <WorkItemIdContext.Provider value={workItemId}>
          <FetchWorkItem url={url}>
            <MaybeAllTheRest visible={!!pat && !!workItemId} />
          </FetchWorkItem>
        </WorkItemIdContext.Provider>
      </PersonalAccessTokenContext.Provider>
    </main>
  )
}

function MaybeAllTheRest({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <>
      <div className={styles.card}>
        <WorkItemAndItsChildren />
      </div>
      <div className={styles.card}>
        <AddTasks />
      </div>
    </>
  )
}
