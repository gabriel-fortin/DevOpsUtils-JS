import { useEffect, useState } from "react"

import { useProjectListCall } from "@/dataAccess/projects"
import { useGetPullRequestsByProjectCall, PullRequestDto } from "@/dataAccess/pullRequest"

import { PrCard } from "./PrCard"


export const LatestPullRequests: React.FC =
  () => {
    const { projectsList, error, isLoading } = useProjectListCall()
    const [perProjectPrDtos, setPerProjectPrDtos] = useState<Record<string, PullRequestDto[]>>({})

    const allPrs = Object.values(perProjectPrDtos).flat()

    // group PRs by repo name
    const prsByRepo = allPrs.reduce((acc, pr) => {
      const repoName = pr.repository.name
      acc[repoName] ??= []
      acc[repoName].push(pr)
      return acc
    }, {} as Record<string, PullRequestDto[]>)

    // transform into a list
    const projList = Object.keys(prsByRepo)
      .map(repoName => ({
        repoName,
        prs: prsByRepo[repoName]
          // put newer PRs first
          .sort((a, b) => b.creationDate.localeCompare(a.creationDate))
      }))
      // put repositories with newer PRs first
      .sort((a, b) => b.prs[0].creationDate.localeCompare(a.prs[0].creationDate))

    return (
      <>
        {isLoading && "Loading..."}
        {error && `Error: ${error.message}`}
        {projectsList && projectsList.map(x =>
          // trick: use a component to call a hook "in a loop"
          <FetchProjectPrs key={x.id} projectName={x.name} prCollectionSetter={setPerProjectPrDtos} />
        )}
        <div className="w-full overflow-x-auto">
          <div className="w-max grid grid-rows-[max-content] auto-cols-[12em]">
            {projList.map(({ repoName }) =>
              <ColumnHeader key={repoName} repoName={repoName} />
            )}
            {projList.map(({ repoName, prs }) =>
              <ColumnContent key={repoName} pullRequests={prs} />
            )}
          </div>
        </div>
      </>
    )
  }


// Collects pull requests' data and puts them into the provided state
function FetchProjectPrs({ projectName, prCollectionSetter: setState }: {
  projectName: string,
  prCollectionSetter: (_updater: React.SetStateAction<Record<string, PullRequestDto[]>>) => void,
}) {
  const { pullRequestsList } = useGetPullRequestsByProjectCall(projectName)

  useEffect(() => {
    if (!pullRequestsList) return
    setState(prevState => ({
      ...prevState,
      [projectName]: pullRequestsList,
    }))
  }, [pullRequestsList, projectName, setState])

  return null
}

const ColumnHeader: React.FC<{
  repoName: string
}> = ({
  repoName,
}) => {
    return (
      <div className={`row-1 bg-base-100 flex flex-col`}>
        <div className="font-bold text-center p-2 mt-auto">
          {repoName}
        </div>
      </div>
    )
  }

const ColumnContent: React.FC<{
  pullRequests: PullRequestDto[]
}> = ({
  pullRequests,
}) => {
    return (
      <div className={`row-2 p-1 bg-base-100`}>
        {pullRequests.map(pr =>
          <PrCard key={pr.pullRequestId} pullRequest={pr} />
        )}
      </div>
    )
  }
