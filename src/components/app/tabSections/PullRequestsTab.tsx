import { LatestPullRequests } from "@/components/pullRequests"

import { Tab } from "../helpers/tabs"


export const PullRequestsTab: React.FC =
  () => {
    return (
      <Tab label="Pull requests">
        <div className="mb-3">
          All pull requests in the organisation.
        </div>
        <LatestPullRequests />
      </Tab>
    )
  }
