"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useIsClient } from "@uidotdev/usehooks"

import { AddTasks } from "@/addingTasks/AddTasks"
import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContext } from "@/contexts/PersonalAccessTokenContext"
import { WorkItemIdContext } from "@/contexts/WorkItemIdContext"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"

import styles from "./page.module.css"


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
        <WorkItemIdContext.Provider value={{ workItemId, setWorkItemId }}>
          {!!pat && !!workItemId &&
            <MaybeAllTheRest workItemId={workItemId} />
          }
        </WorkItemIdContext.Provider>
      </PersonalAccessTokenContext.Provider>
    </main>
  )
}

function MaybeAllTheRest({ workItemId }: { workItemId: number }) {
  return (
     <>
      <div className={styles.card}>
        <WorkItemAndItsChildren workItemId={workItemId} />
      </div>
      <div className={styles.card}>
        <AddTasks />
      </div>
    </>
  )
}
