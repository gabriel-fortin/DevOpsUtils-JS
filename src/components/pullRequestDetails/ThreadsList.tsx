import { useGetPrThreadsCall } from "@/dataAccess/pullRequest"
import { useSelectedPr } from "@/state/selectedPr"

import { ThreadItem } from "./Thread"


export const ThreadsList: React.FC = () => {
	const { selectedPr: pr } = useSelectedPr()
	const { threads, error, isLoading } = useGetPrThreadsCall(
		pr?.repository.project.name,
		pr?.repository.name,
		pr?.pullRequestId,
	)

	const showThreads = threads && threads.length > 0
	const showNoThreadsMessage = !isLoading && !error && !showThreads

	const filteredAndSortedThreads = (threads ?? [])
		.filter(t => t.comments[0]?.commentType === 'text')
		.sort((a, b) =>
			new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
		)

	return (
		<>
			{isLoading &&
				<div className="text-sm">Loading threads...</div>
			}
			{error &&
				<div className="text-sm text-error">Error loading threads: {error.message}</div>
			}
			{showNoThreadsMessage &&
				<div className="text-sm text-muted">No threads for this PR.</div>
			}
			{showThreads &&
				<div className="space-y-2">
					{filteredAndSortedThreads.map(t => (
						<ThreadItem key={t.id} thread={t} />
					))}
				</div>
			}
		</>
	)
}

