import { useOrgUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"


export const PullRequestDetails: React.FC = () => {
	return (
		<>
			<SelectedPrLink />
			<ClearSelectedPrButton />
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
			PR #{pr!.pullRequestId}
		</a>
	)
}

const ClearSelectedPrButton: React.FC = () => {
	const { setSelectedPr } = useSelectedPr()

	return (
		<button onClick={() => setSelectedPr(null)}
			className="btn btn-xs ml-2"
			aria-label="Clear selected PR">
			✕
		</button>
	)
}