

export type ThreadDto = {
    pullRequestThreadContext: PullRequestThreadContext | null
    id: number
    publishedDate: string
    lastUpdatedDate: string
    comments: Comment[]
    threadContext: PullRequestThreadContext | null
    properties: PullRequestThreadProperties
    isDeleted: boolean
    status?: string
}

export type PullRequestThreadProperties = {
    [key: string]: PropertyValue
}

export type PullRequestThreadContext = {
    iterationContext?: {
        firstComparingIteration: number
        secondComparingIteration: number
    }
    changeTrackingId?: number
    filePath?: string
    rightFileStart?: {
        line: number
        offset: number
    }
    rightFileEnd?: {
        line: number
        offset: number
    }
}

export type Author = {
    id: string
    displayName: string
    url: string
    imageUrl: string
    isContainer?: boolean
    uniqueName?: string
}

export type Comment = {
    id: number
    parentCommentId: number
    author: Author
    content?: string
    publishedDate: string
    lastUpdatedDate: string
    commentType: "system" | "text"
    usersLiked: unknown[]
    isDeleted?: boolean
}

export interface PropertyValue<T = string | number> {
    $type: string
    $value: T
}
