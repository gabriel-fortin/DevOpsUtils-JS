import { Tab } from "../helpers/tabs"
import Card from "../helpers/Card"


export const PullRequestsTab: React.FC =
  () => {
    return (
      <Tab label="Pull requests">
        <Card>
          Some summary of active pull requests. Maybe grouped by project. Maybe by date.
          Maybe untouched ones will be displayed first.
        </Card>
      </Tab>
    )
  }

