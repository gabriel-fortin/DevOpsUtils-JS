import { useOrgUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"

import { ThreadsList } from "./ThreadsList"


export const PullRequestDetails: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <SelectedPrLink />
        <CloseButton />
      </div>

      {/* main content: threads */}
      <div className="mt-2">
        <ThreadsList />
      </div>
    </>
  )
}

const SelectedPrLink: React.FC = () => {
  const orgUrl = useOrgUrl()
  const { selectedPr: pr } = useSelectedPr()

  if (!pr) return null

  const prWebUrl = `${orgUrl}/${pr.repository.project.name}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`

  return (
    <a href={prWebUrl} target="_blank" rel="noreferrer"
      className="link link-secondary">
      show !{pr.pullRequestId} in DevOps
    </a>
  )
}

const CloseButton: React.FC = () => {
  const { setSelectedPr } = useSelectedPr()

  return (
    <button onClick={() => setSelectedPr(null)}
      className="btn btn-sm btn-circle btn-primary ml-2"
      aria-label="Close details view">
      ✕
    </button>
  )
}