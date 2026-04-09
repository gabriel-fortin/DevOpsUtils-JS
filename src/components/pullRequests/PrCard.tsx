import type { PropsWithChildren } from "react"

import { PullRequestDto, ThreadDto, useGetPrThreadsCall } from "@/dataAccess/pullRequest"
import { useSelectedPr } from "@/state/selectedPr"


export const PrCard: React.FC<{
  pullRequest: PullRequestDto
}> = ({
  pullRequest: pr,
}) => {
    return (
      <CardOutline pullRequest={pr}>
        <CardHeader pullRequest={pr} />

        {/* CONTENT - PR title */}
        <div className="">
          {pr.title}
        </div>

        {/* FOOTER - creation date */}
        <div className="text-sm text-primary-content/50 flex gap-2 mt-1">
          <span> created </span>
          <span> {new Date(pr.creationDate).toLocaleDateString()} </span>
          <span> {new Date(pr.creationDate).toLocaleTimeString().slice(0, -3)} </span>
        </div>
        {/* FOOTER - author */}
        <div className="text-sm text-primary-content/50 flex gap-2">
          <span> by </span>
          <span> {pr.createdBy.displayName} </span>
        </div>
      </CardOutline>
    )
  }

const CardOutline: React.FC<PropsWithChildren<{
  pullRequest: PullRequestDto
}>> = ({
  pullRequest: pr,
  children,
}) => {
    const { setSelectedPr } = useSelectedPr()

  return (
    <div className="mb-2 p-2 border border-base-200 rounded-md cursor-pointer
                    hover:bg-base-200 hover:border-secondary transition-colors duration-200"
      onClick={() => setSelectedPr(pr)}
    >
      {children}
    </div >
  )
}

const CardHeader: React.FC<{
  pullRequest: PullRequestDto
}> = ({
  pullRequest: pr,
}) => {
    const { threads, error, isLoading } =
      useGetPrThreadsCall(
        pr.repository.project.name,
        pr.repository.name,
        pr.pullRequestId)

    const reviewCommentsOrVotes = threads?.filter(looksLikeReviewAction) ?? []
    const reviewersAvatars: string[] = unique(reviewCommentsOrVotes.map(extractAvatarUrl))
    const showAttentionBadge = !isLoading && !error && (reviewCommentsOrVotes.length === 0)

    return (
      <div className="text-primary-content/50 flex flex-wrap justify-end gap-1">

        {/* PR id */}
        <span className="ml-3 mr-auto pr-3 justify-self-start">
          #{pr.pullRequestId}
        </span>

        {/* error badge */}
        {(error || !threads) &&
          <span className="badge badge-error rounded-full animate-pulse tooltip"
            data-tip={error?.message ?? "Failed to load PR threads"}>
            err!
          </span>
        }

        {/* 'new' badge */}
        {showAttentionBadge &&
          <span className="badge badge-warning text-black rounded-full tooltip"
            data-tip="new = Has no review comments, might need attention">
            new
          </span>
        }

        {/* avatars */}
        {reviewersAvatars.map(imgUrl =>
          <img key={imgUrl} src={imgUrl} alt="Reviewer Avatar" className="w-6 h-6 rounded-full" />
        )}
      </div>
    )
  }

function looksLikeReviewAction(thread: ThreadDto): boolean {
  // commenting on the PR
  if (thread.comments[0].commentType === "text") return true

  if (thread.comments[0].commentType === "system") {
    // voting for the PR
    if (thread.properties["CodeReviewThreadType"].$value === "VoteUpdate") return true

    // joining as a reviewer – not included because it can be set by anybody
    // if (thread.properties["CodeReviewThreadType"].$value === "ReviewersUpdate") return true
  }

  return false
}

function extractAvatarUrl(thread: ThreadDto): string {
  if (thread.comments[0].commentType === "text") {
    return thread.comments[0].author._links.avatar.href
  }

  return thread.identities[1].imageUrl
}

function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}
