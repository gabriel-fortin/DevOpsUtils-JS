"use client"

import React, { useState } from "react"
import Image from "next/image"

import styles from "./page.module.css"
import { PatAuth } from "@/auth/PatAuth"
import { Title } from "@/Title"
import { PersonalAccessTokenContext } from "@/auth/PersonalAccessTokenHolder"


export default function MyMainPage() {
  const [pat, setPat] = useState("")

  return (
    <main className={styles.main}>
      <h1>A tool for chores in DevOps projects</h1>
      <PersonalAccessTokenContext.Provider value={pat}>
        <PatAuth onPatChange={setPat}/>
        <Title id={5296} />
      </PersonalAccessTokenContext.Provider>
    </main>
  )
}
