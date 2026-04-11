import { ThreadDto } from "@/dataAccess/pullRequest"

import { THREAD_STATUSES } from "./constants"


export const Thread: React.FC<{
  thread: ThreadDto
}> = ({
  thread
}) => {
    return (
      <div className="p-3 pt-2 border rounded-md bg-base-100">

        {/* thread header */}
        <div className="text-xs text-primary-content/90
                        mb-2 flex justify-between gap-3 items-center">
          <span className="mr-auto">
            Thread {thread.id}
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
                    onClick={() => alert("This will set the status")}>
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
