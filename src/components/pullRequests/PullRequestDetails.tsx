import { ThreadDto, useGetPrThreadsCall } from "@/dataAccess/pullRequest"
import { useOrgUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"


export const PullRequestDetails: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <SelectedPrLink />
        <CloseButton />
      </div>

      {/* Threads area */}
      <div className="mt-2">
        <ThreadsDisplay />
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
      PR #{pr!.pullRequestId}
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

const ThreadsDisplay: React.FC = () => {
  const { selectedPr: pr } = useSelectedPr()
  const { threads, error, isLoading } = useGetPrThreadsCall(
    pr?.repository.project.name,
    pr?.repository.name,
    pr?.pullRequestId,
  )

  const showNoThreadsMessage = !isLoading && !error && (!threads || threads.length === 0)
  const showThreads = threads && threads.length > 0

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
        <ThreadList threads={threads!} />
      }
    </>
  )
}

const ThreadList: React.FC<{
  threads: ThreadDto[]
}> = ({
  threads
}) => {
    const filteredAndSorted = threads
      .filter(t => t.comments[0]?.commentType === 'text')
      .sort((a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      )
    return (
      <div className="space-y-2">
        {filteredAndSorted.map(t => (
          <ThreadItem key={t.id} thread={t} />
        ))}
      </div>
    )
  }

const THREAD_STATUSES = ["active", "pending", "resolved", "won't fix", "closed"]

const StatusDropdown: React.FC<{
  status: string
}> = ({
  status
}) => {
    return (
      <div className="dropdown dropdown-hover">
        <button className="btn btn-xs btn-primary w-22">{status}</button>
        <ul className="dropdown-content menu bg-base-200 rounded-box shadow">
          {THREAD_STATUSES.map(s => (
            <li key={s}>
              <span className="text-secondary-content" onClick={() => alert("This will set the status")}>
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

const ThreadItem: React.FC<{
  thread: ThreadDto
}> = ({
  thread
}) => {
    return (
      <div className="p-3 pt-2 border rounded-md bg-base-100">
        {/* thread item header */}
        <div className="text-xs text-primary-content/90 mb-2 flex justify-between items-center gap-3">
          <span className="mr-auto">Thread {thread.id}</span>
          <StatusDropdown status={thread.status || "???"} />
          <span>{new Date(thread.publishedDate).toLocaleString()}</span>
        </div>

        {/* show comments */}
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