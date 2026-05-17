import { useGetPrThreadsCall } from "@/dataAccess/pullRequest"
import { useSelectedPr } from "@/state/selectedPr"

import { Thread } from "./Thread"


export const ThreadsList: React.FC<{
	activeStatuses: Set<string>
}> = ({
	activeStatuses
}) => {
	const { selectedPr: pr } = useSelectedPr()
	const { threads, error, isLoading } = useGetPrThreadsCall(
		pr?.repository.project.name,
		pr?.repository.name,
		pr?.pullRequestId,
	)

	const hasThreads = threads && threads.length > 0
	const showNoThreadsMessage = !isLoading && !error && !hasThreads

	const conversationThreads = (threads ?? [])
		.filter(t => t.comments[0]?.commentType === 'text')
		.filter(t => activeStatuses.size === 0 || activeStatuses.has(t.status ?? ""))
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
			{conversationThreads.length === 0 &&
				<div className="text-sm text-muted">All threads are filtered out.</div>
			}
			{conversationThreads.length > 0 &&
				<div className="space-y-2">
					{conversationThreads.map(t => (
						<Thread key={t.id} thread={t} />
					))}
				</div>
			}
		</>
	)
}

