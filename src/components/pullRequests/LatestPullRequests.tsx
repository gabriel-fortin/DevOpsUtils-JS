import { useEffect, useState } from "react"

import { useProjectListCall } from "@/dataAccess/projects"
import { useGetPullRequestsByProjectCall, PullRequestDto } from "@/dataAccess/pullRequest"


export const LatestPullRequests: React.FC =
  () => {
    const { projectsList, error, isLoading } = useProjectListCall()
    const [prDtos, setPrDtos] = useState<Record<string, PullRequestDto[]>>({})

    const allPrs = Object.values(prDtos).flat()

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
          <PrCollector key={x.id} projectName={x.name} setState={setPrDtos} />
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
function PrCollector({ projectName, setState }: {
  projectName: string,
  setState: (_updater: React.SetStateAction<Record<string, PullRequestDto[]>>) => void,
}) {
  const { pullRequestsList } = useGetPullRequestsByProjectCall(projectName)

  useEffect(() => {
    if (pullRequestsList) {
      setState(prevState => ({
        ...prevState,
        [projectName]: pullRequestsList,
      }))
    }
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
          // PR card
          <div key={pr.pullRequestId} className="mb-2 p-2 border border-base-200 rounded-md
                                            hover:bg-base-200 hover:border-secondary transition-colors duration-200">
                                              
            <div className="text-center text-primary-content/30">
              #{pr.pullRequestId}
            </div>

            <div className="">
              {pr.title}
            </div>

            <div className="text-sm text-primary-content/50 flex gap-2 mt-1">
              <span> created </span>
              <span> {new Date(pr.creationDate).toLocaleDateString()} </span>
              <span> {new Date(pr.creationDate).toLocaleTimeString().slice(0, -3)} </span>
            </div>

            <div className="text-sm text-primary-content/50 flex gap-2">
              <span> by </span>
              <span> {pr.createdBy.displayName} </span>
            </div>
          </div>
        )}
      </div>
    )
  }
