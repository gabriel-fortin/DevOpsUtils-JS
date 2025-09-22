"use client"

import React, { useEffect, useRef, useState } from "react"

import { useProjectUrlStorage } from "@/dataAccess/projectUrl"
import { useProjectUrl } from "@/state/projectUrl"


export const SelectProjectUrl: React.FC =
  (
  ) => {
    const repo = useProjectUrlStorage()
    const [isAddingProject, setIsAddingProject] = useState(false)
    const { projectUrl: currentProjectUrl, setProjectUrl, removeProjectUrl } = useProjectUrl()

    const selectProject = (projectName: string) => () => {
      setProjectUrl(projectName)
    }

    const removeProject = (projectName: string) => () => {
      repo.removeProject(projectName)
      removeProjectUrl()
    }

    const handleLinkClick = () => {
      setIsAddingProject(true)
    }

    const handleNewProjectAdded = (projectName: string) => {
      if (!projectName || !projectName.trim()) return

      repo.addProject(projectName)
      setIsAddingProject(false)
    }

    const handleNewProjectCancelled = () => {
      setIsAddingProject(false)
    }

    const projectList = repo.projectList
    const hasProjects = projectList.length > 0

    return (
      <div className="flex flex-col gap-3">
        <h2 className="ml-1 text-xl">
          Select project
        </h2>

        {hasProjects && projectList.map(savedProjectName => (
          <ProjectItem key={savedProjectName}
            isSelected={savedProjectName == currentProjectUrl}
            projectName={savedProjectName}
            onProjectSelected={selectProject(savedProjectName)}
            onProjectRemoved={removeProject(savedProjectName)}
          />
        ))
        }

        {isAddingProject
          && <NewProjectInput onProjectSubmitted={handleNewProjectAdded} onNewProjectCancelled={handleNewProjectCancelled} />
          || <NewProjectButton onLinkClicked={handleLinkClick} isHighlighted={!hasProjects} />
        }
      </div>
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
    const classesWhenSelected = isSelected && "border-secondary hover:border-secondary"

    const handleRemoveProject: React.MouseEventHandler<HTMLElement> = e => {
      e.stopPropagation()
      removeProject()
    }

    return (
      <div
        className={`btn flex flex-row flex-flex-nowrap ${classesWhenSelected}`}
        onClick={selectProject}>
        <span className="grow text-left">
          {projectName}
        </span>
        <span className="btn btn-outline btn-md -my-8 -mr-4 border-0"
          onClick={handleRemoveProject}>
          ❌
        </span>
      </div>
    )
  }

const NewProjectButton: React.FC<{
  onLinkClicked: () => void
  isHighlighted: boolean
}> = ({
  onLinkClicked: clickLink,
  isHighlighted,
}) => {
    return (
      <div onClick={clickLink} className={`w-fit btn btn-sm ${isHighlighted && "btn-accent"}`}>
        add project...
      </div>
    )
  }

const NewProjectInput: React.FC<{
  onProjectSubmitted: (_projectName: string) => void
  onNewProjectCancelled: () => void
}> = ({
  onProjectSubmitted: submitProject,
  onNewProjectCancelled: cancel,
}) => {
    const projectNameInputRef = useRef<HTMLInputElement>()

    const addNewProject = () => {
      if (projectNameInputRef.current === undefined) {
        console.warn("Ref for the project name input has not been set yet")
        return
      }
      const newProjectName: string = projectNameInputRef.current?.value
      submitProject(newProjectName)
    }

    useEffect(() => projectNameInputRef.current?.focus(), [])

    return (
      <div className="flex items-center input input-sm input-bordered px-0">
        <div
          className="btn btn-sm btn-accent btn-outline mr-2"
          onClick={cancel}>
          X
        </div>
        {/* cast to LegacyRef because TS types are botched; hopefully we can remove the cast in the future */}
        <input ref={projectNameInputRef as React.LegacyRef<HTMLInputElement>}
          placeholder="project URL"
          className="grow"
        />
        <div
          className="btn btn-sm btn-accent"
          onClick={addNewProject}>
          Add
        </div>
      </div>
    )
  }
