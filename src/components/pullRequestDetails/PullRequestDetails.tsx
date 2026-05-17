import { useState } from "react"

import { useOrgUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"

import { ThreadsList } from "./ThreadsList"
import { THREAD_STATUSES } from "./constants"


export const PullRequestDetails: React.FC = () => {
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(new Set())

  const toggleStatus = (status: string) => {
    setActiveStatuses(prev => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  return (
    <>
      <div className="flex gap-5 items-center">
        <CloseButton />
        <SelectedPrLink />
        <Title />
      </div>

      {/* main content: threads */}
        <FiltersPanel activeStatuses={activeStatuses} toggleStatus={toggleStatus} />
        <ThreadsList activeStatuses={activeStatuses} />
    </>
  )
}

const FiltersPanel: React.FC<{
  activeStatuses: Set<string>
  toggleStatus: (_status: string) => void
}> = ({
  activeStatuses,
  toggleStatus,
}) => {
    return (
      <div className="flex gap-3 mb-2 flex-wrap w-fit ml-auto bg-base-200 p-2 rounded-xl">
        <span className="ml-2">Filtering:</span>
        {THREAD_STATUSES.map(s => (
          <button key={s}
            onClick={() => toggleStatus(s)}
            className={`btn btn-xs ${activeStatuses.has(s) ? "btn-primary" : "btn-soft"}`}
          >
            {s}
          </button>
        ))}
      </div>
    )
  }

const SelectedPrLink: React.FC = () => {
  const orgUrl = useOrgUrl()
  const { selectedPr: pr } = useSelectedPr()

  if (!pr) return null

  const prWebUrl = `${orgUrl}/${pr.repository.project.name}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`

  return (
    <span onClick={() => window.open(prWebUrl, '_blank')}
      className="link link-secondary cursor-pointer"
    >
      show !{pr.pullRequestId} in DevOps
    </span>
  )
}

const CloseButton: React.FC = () => {
  const { setSelectedPr } = useSelectedPr()

  return (
    <button onClick={() => setSelectedPr(null)}
      className="btn btn-circle btn-accent text-primary"
      aria-label="Close details view">
      ✕
    </button>
  )
}

const Title: React.FC = () => {
  const { selectedPr: pr } = useSelectedPr()

  return (
    <div className="font-bold">
      {pr?.title}
    </div>
  )
}