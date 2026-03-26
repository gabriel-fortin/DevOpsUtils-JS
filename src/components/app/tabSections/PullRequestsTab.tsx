import { LatestPullRequests, PullRequestDetails } from "@/components/pullRequests"
import { SelectedPrContextProvider, WhenSelectedPrExists, WhenSelectedPrIsNull } from "@/state/selectedPr"

import { Tab } from "../helpers/tabs"


export const PullRequestsTab: React.FC =
  () => {
    return (
      <Tab label="Pull requests">
        <SelectedPrContextProvider>

          <WhenSelectedPrExists>
            <PullRequestDetails />
          </WhenSelectedPrExists>

          <WhenSelectedPrIsNull>
            <div className="mb-3">
              All pull requests in the organisation.
            </div>
            <LatestPullRequests />
          </WhenSelectedPrIsNull>

        </SelectedPrContextProvider>
      </Tab>
    )
  }

