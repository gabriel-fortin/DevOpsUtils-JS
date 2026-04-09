import { useOrgUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"

import { ThreadsList } from "./ThreadsList"


export const PullRequestDetails: React.FC = () => {
  return (
    <>
      <div className="flex gap-5 items-center">
        <CloseButton />
        <SelectedPrLink />
        <Title />
      </div>

      {/* main content: threads */}
      <div className="mt-3">
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