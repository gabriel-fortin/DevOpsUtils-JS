import { ThreadDto, useUpdateThreadStatusCall } from "@/dataAccess/pullRequest"
import { ProjectUrlContext, useOrgUrl, useProjectUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"

import { THREAD_STATUSES } from "./constants"
import { useEffect, useState } from "react"


export const Thread: React.FC<{
    thread: ThreadDto
  }> = ({
    thread
  }) => {
      const { selectedPr: pr } = useSelectedPr()
      const { projectUrl, setProjectUrl } = useProjectUrl()

      const modifiedProjectUrl = (() => {
        if (!projectUrl || !pr) return projectUrl
        const trimmed = projectUrl.endsWith("/") ? projectUrl.slice(0, -1) : projectUrl
        const base = trimmed.substring(0, trimmed.lastIndexOf("/"))
        return `${base}/${pr.repository.project.name}`
      })()

      return (
        <ProjectUrlContext.Provider value={{ value: modifiedProjectUrl, setter: setProjectUrl }}>
          <ThreadInternal thread={thread} />
        </ProjectUrlContext.Provider>
      )
    }

  const ThreadInternal: React.FC<{
  thread: ThreadDto
}> = ({
  thread
}) => {
    const orgUrl = useOrgUrl()
    const { selectedPr: pr } = useSelectedPr()
    const [toasts, setToasts] = useState<{ text: string, id: string }[]>([])

    const { trigger: setThreadStatus, isMutating, error } = useUpdateThreadStatusCall(
      pr?.repository.project.name,
      pr?.repository.name,
      pr?.pullRequestId,
      thread.id,
    )

    // display errors in toasts and log them to console
    useEffect(() => {
      if (!error) return

      // distinguish between array of errors and single error object
      const errors = Array.isArray(error) ? error : [error.message]

      errors.forEach(e => {
        console.warn("Error updating thread status:", e)
      })

      const newToastItems = errors.map(e => ({
        text: e,
        id: Math.random().toString(36).substring(2, 15)
      }))
      // add new toasts to the end of the array
      setToasts(prev => [...prev, ...newToastItems])

      setTimeout(() => {
        // when the time comes, the toasts are removed from the beginning of the array
        // (all toasts previously at the front were already removed at this point in time)
        setToasts(prev => prev.slice(newToastItems.length))
      }, 8000)
    }, [error])

    const threadUrl = pr
      ? `${orgUrl}/${pr.repository.project.name}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}?discussionId=${thread.id}#${thread.comments[0]?.id}`
      : undefined

    return (
      <div className="p-3 pt-2 border rounded-md bg-base-100">
        {/* toasts */}
        <div className="toast">
          {toasts.map((toast) => (
            <div key={toast.id} className="alert alert-warning">
              {toast.text}
            </div>
          ))
          }
        </div>

        {/* thread header */}
        <div className="text-xs text-primary-content/90
                        mb-2 flex justify-between gap-3 items-center">
          <span className="mr-auto">
            <span onClick={() => window.open(threadUrl, '_blank')}
              role="link"
              className="link link-secondary cursor-pointer">
              Thread {thread.id}
            </span>
          </span>
          <StatusDropdown
            status={thread.status || "???"}
            onStatusChange={setThreadStatus}
            isMutating={isMutating}
          />
          <span>
            {new Date(thread.publishedDate).toLocaleString()}
          </span>
        </div>

        {/* thread comments */}
        <div className="space-y-2 text-sm">
          {thread.comments.map(c => (
            <div key={c.id}>
              <div className="flex gap-3 text-xs text-primary-content/50">
                <div>{c.author.displayName}</div>
                <div>{new Date(c.publishedDate).toLocaleString()}</div>
              </div>
              <div className="whitespace-pre-wrap">{c.content}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

const StatusDropdown: React.FC<{
  status: string
  onStatusChange: (_newStatus: string) => void
  isMutating: boolean
}> = ({
  status,
  onStatusChange,
  isMutating,
}) => {
    return (
      <div className="dropdown dropdown-hover">
        <button
          disabled={isMutating}
          className="btn btn-xs btn-primary w-24">{status}</button>
        <ul className="dropdown-content menu bg-base-200 rounded-box shadow">
          {THREAD_STATUSES.map(s => (
            <li key={s}>
              <span className="text-secondary-content"
                onClick={() => onStatusChange(s)}
              >
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
