"use client"

import React, { useState } from "react"
import Image from "next/image"

import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContext } from "@/contexts/PersonalAccessTokenContext"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"

import styles from "./page.module.css"
import { WorkItemIdContext } from "@/contexts/WorkItemIdContext"
import { AddTasks } from "@/addingTasks/AddTasks"


export default function MyMainPage() {
  const [pat, setPat] = useState("")
  const [workItemId, setWorkItemId] = useState<number | null>(null)
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
          <MaybeAllTheRest visible={!!pat && !!workItemId} />
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
