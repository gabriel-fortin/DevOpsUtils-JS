import { ThreadDto } from "@/dataAccess/pullRequest"
import { useOrgUrl } from "@/state/projectUrl"
import { useSelectedPr } from "@/state/selectedPr"

import { THREAD_STATUSES } from "./constants"


export const Thread: React.FC<{
  thread: ThreadDto
}> = ({
  thread
}) => {
    const orgUrl = useOrgUrl()
    const { selectedPr: pr } = useSelectedPr()

    const threadUrl = pr
      ? `${orgUrl}/${pr.repository.project.name}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}?discussionId=${thread.id}#${thread.comments[0]?.id}`
      : undefined

    return (
      <div className="p-3 pt-2 border rounded-md bg-base-100">

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
          <StatusDropdown status={thread.status || "???"} />
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
}> = ({
  status
}) => {
    return (
      <div className="dropdown dropdown-hover">
        <button className="btn btn-xs btn-primary w-24">{status}</button>
        <ul className="dropdown-content menu bg-base-200 rounded-box shadow">
          {THREAD_STATUSES.map(s => (
            <li key={s}>
              <span className="text-secondary-content"
                onClick={() => alert("This will set the status")}
              >
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
