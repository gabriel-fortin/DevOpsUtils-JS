
export type PullRequestDto = {
    repository: Repository
    pullRequestId: number
    codeReviewId: number
    status: string
    createdBy: Identity
    creationDate: string
    title: string
    description?: string
    sourceRefName: string
    targetRefName: string
    mergeStatus: string
    isDraft: boolean
    mergeId: string
    lastMergeSourceCommit: CommitRef
    lastMergeTargetCommit: CommitRef
    reviewers: Reviewer[]
    url: string
    completionOptions?: CompletionOptions
    supportsIterations: boolean
}

export type Repository = {
    id: string
    name: string
    url: string
    project: Project
}

export type Project = {
    id: string
    name: string
    state: string
    visibility: string
    lastUpdateTime: string
}

export type Identity = {
    displayName: string
    url: string
    _links: {
        avatar: {
            href: string
        }
    }
    id: string
    uniqueName: string
    imageUrl: string
    descriptor: string
}

export type CommitRef = {
    commitId: string
    url: string
}

export type Reviewer = {
    reviewerUrl: string
    vote: number
    hasDeclined: boolean
    isRequired: boolean
    isFlagged: boolean
    displayName: string
    url: string
    _links: {
        avatar: {
            href: string
        }
    }
    id: string
    uniqueName: string
    imageUrl: string
}

export type CompletionOptions = {
    mergeStrategy: string
    autoCompleteIgnoreConfigIds: unknown[]
}