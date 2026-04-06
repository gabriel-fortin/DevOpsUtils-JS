import { LatestPullRequests, PullRequestDetails } from "@/components/pullRequests"
import { SelectedPrContextProvider, WhenSelectedPrExists, WhenSelectedPrIsNull } from "@/state/selectedPr"

import { useOrgUrl } from "@/state/projectUrl"

import { Tab } from "../helpers/tabs"


export const PullRequestsTab: React.FC =
  () => {
    const orgUrl = useOrgUrl()

    return (
      <Tab label="Pull requests">
        <SelectedPrContextProvider>

          <WhenSelectedPrExists>
            <PullRequestDetails />
          </WhenSelectedPrExists>

          <WhenSelectedPrIsNull>
            <div className="mb-3">
              All pull requests in organisation:
              <span className="ml-2">{orgUrl}</span>
            </div>
            <LatestPullRequests />
          </WhenSelectedPrIsNull>

        </SelectedPrContextProvider>
      </Tab>
    )
  }

