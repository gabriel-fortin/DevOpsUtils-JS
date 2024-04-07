"use client"

import React, { useState } from "react"
import Image from "next/image"

import { PatAuth } from "@/auth/PatAuth"
import { PersonalAccessTokenContext } from "@/contexts/PersonalAccessTokenContext"
import { SelectWorkItem } from "@/selectWorkItem/SelectWorkItem"
import { WorkItemAndItsChildren } from "@/showWorkItems/WorkItemAndItsChildren"

import styles from "./page.module.css"


export default function MyMainPage() {
  const [pat, setPat] = useState("")

  return (
    <main className={styles.main}>
      <h1>A tool for chores in DevOps projects</h1>
      <PersonalAccessTokenContext.Provider value={pat}>
        <div className={styles.card}>
          <PatAuth onPatChange={setPat} />
        </div>
        {pat !== "" && <AllTheRest />}
      </PersonalAccessTokenContext.Provider>
    </main>
  )
}

function AllTheRest() {
  const [workItemId, setWorkItemId] = useState<number | null>(null)
  return (
    <>
      <div className={styles.card}>
        <SelectWorkItem onWorkItemSelected={setWorkItemId} />
      </div>
      {workItemId &&
    <div className={styles.card}>
          <WorkItemAndItsChildren id={workItemId} />
    </div>
      }
    </>
    )
}
