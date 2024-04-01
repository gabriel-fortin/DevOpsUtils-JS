"use client"

import React from "react"
import Image from "next/image"

import styles from "./page.module.css"
import { PatAuthorization } from "./PatAuthorization"
import { Title } from "./Title"


export default function MyMainPage() {
  return (
    <main className={styles.main}>
      HELLO
      <PatAuthorization>
        <Title id={5296} />
      </PatAuthorization>
    </main>
  )
}
