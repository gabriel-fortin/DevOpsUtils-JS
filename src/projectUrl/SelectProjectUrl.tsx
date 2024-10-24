"use client"

import React, { CSSProperties, useEffect, useRef, useState } from "react"

import { useProjectUrl } from "@/contexts/ProjectUrlContext"

import { useProjectUrlRepository } from "./repository"


export const SelectProjectUrl: React.FC<{
}> = ({
}) => {
    const repo = useProjectUrlRepository()
    const [isAddingProject, setIsAddingProject] = useState(false)
    const [currentProjectUrl, setProjectUrl] = useProjectUrl()

    const selectProject = (projectName: string) => () => {
      setProjectUrl(projectName)
    }

    const removeProject = (projectName: string) => () => {
      repo.removeProject(projectName)
      setProjectUrl("")
    }

    const handleLinkClick = () => {
      setIsAddingProject(true)
    }

    const handleNewProjectAdded = (projectName: string) => {
      repo.addProject(projectName)
      setIsAddingProject(false)
    }

    return (
      <>
        <h2>Select project</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>

          {repo.projectList.map(savedProjectName => (
            <ProjectItem key={savedProjectName}
              isSelected={savedProjectName == currentProjectUrl}
              projectName={savedProjectName}
              onProjectSelected={selectProject(savedProjectName)}
              onProjectRemoved={removeProject(savedProjectName)}
            />
          ))}

          {isAddingProject
            && <NewProjectInput onProjectSubmitted={handleNewProjectAdded} />
            || <NewProjectLink onLinkClicked={handleLinkClick} />
          }
        </div>
      </>
    )
  }

const ProjectItem: React.FC<{
  isSelected: boolean
  projectName: string
  onProjectSelected: () => void
  onProjectRemoved: () => void
}> = ({
  isSelected,
  projectName,
  onProjectSelected: selectProject,
  onProjectRemoved: removeProject,
}) => {
    const projectItemStyle: CSSProperties = {
      padding: "0.3em 0.5em 0.4em 0.6em",
      border: "3px dotted #333333",
      borderRadius: "14px",
      display: "flex", justifyContent: "space-between",
      cursor: "default",
    }
    if (isSelected) {
      projectItemStyle.border = "2px solid darkolivegreen"
    }

    return (
      <div style={projectItemStyle} onClick={selectProject}>
        <span style={{ width: "100%" }}>
          {projectName}
        </span>
        <span style={{ fontSize: "0.8em", alignSelf: "center" }} onClick={removeProject}>
          ❌
        </span>
      </div>
    )
  }

const NewProjectLink: React.FC<{
  onLinkClicked: () => void
}> = ({
  onLinkClicked: clickLink
}) => {
    const linkStyle = { color: "steelblue", textDecoration: "underline", fontSize: "0.8em" }

    return (
      <div style={{ marginLeft: "0.5em" }}>
        <a onClick={clickLink} href="#" style={linkStyle}>
          add project...
        </a>
      </div>
    )
  }

const NewProjectInput: React.FC<{
  onProjectSubmitted: (projectName: string) => void
}> = ({
  onProjectSubmitted: submitProject,
}) => {
    const projectNameInputRef = useRef<HTMLInputElement>()

    const addNewProject = () => {
      const newProjectName: string = projectNameInputRef.current?.value!
      submitProject(newProjectName)
    }

    useEffect(() => projectNameInputRef.current?.focus(), [])

    return (
      <div style={{ display: "flex", gap: "0.5em" }}>
        {/* cast to LegacyRef because TS types are botched; hopefully we can remove the cast in the future */}
        <input ref={projectNameInputRef as React.LegacyRef<HTMLInputElement>}
          placeholder="project URL" style={{ flexGrow: 1 }} />
        <button onClick={addNewProject}>Add</button>
      </div>
    )
  }
