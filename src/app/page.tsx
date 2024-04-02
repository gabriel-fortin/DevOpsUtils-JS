"use client"

import React from "react"
import Image from "next/image"

import styles from "./page.module.css"
import { PatAuth } from "@/auth/PatAuth"
import { Title } from "@/Title"


export default function MyMainPage() {
  return (
    <main className={styles.main}>
      <h1>A tool for chores in DevOps projects</h1>
      <PatAuth>
        <Title id={5296} />
      </PatAuth>
    </main>
  )
}
