"use client"

import React from "react"

import { BASE_URL } from "@/constants"

import { DisplayWorkItem } from "./DisplayWorkItem"
import { FetchWorkItem } from "./FetchWorkItem"


export const WorkItemAndItsChildren: React.FC<{
  id: number
}> = ({
  id,
}) => {
    const url = `${BASE_URL}/${id}?$expand=Relations`

    const listItem = {
      display: "list-item",
      margin: "0.4em 0 0.4em 1em",
    }

    return (
      <div>
        <FetchWorkItem url={url}>
          {wi =>
            <DisplayWorkItem wi={wi}>
              {childUrl =>
                <div style={listItem}>
                  <FetchWorkItem url={childUrl}>
                    {childWi => <DisplayWorkItem wi={childWi} />}
                  </FetchWorkItem>
                </div>
              }
            </DisplayWorkItem>
          }
        </FetchWorkItem>
      </div>
    )
  }


