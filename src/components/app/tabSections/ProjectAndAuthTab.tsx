import { PatAuth } from "@/components/auth"
import { SelectProjectUrl } from "@/components/selectProjectUrl"

import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useProjectUrl } from "@/state/projectUrl"

import { Tab } from "../helpers/tabs"
import Card from "../helpers/Card"


export const ProjectAndAuthTab: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()
    const { patValue } = usePersonalAccessToken()
    const thisTabRequiresAttention =
      (isCurrent: boolean) => !isCurrent && (!projectUrl || !patValue)

    return (
      <Tab label="Project & auth" hasDot={thisTabRequiresAttention}>
        <div className=" flex flex-col gap-5">
          <SelectProjectCard />
          <PatAuthCard />
        </div>
      </Tab>
    )
  }

const SelectProjectCard: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()

    const requiresAttention = !projectUrl

    return (
      <Card isHighlighted={requiresAttention}>
        <SelectProjectUrl />
      </Card>
    )
  }

const PatAuthCard: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()
    const { patValue } = usePersonalAccessToken()

    const requiresAttention = !!projectUrl && !patValue

    return (
      <Card isHighlighted={requiresAttention}>
        <PatAuth requiresAttention={requiresAttention} />
      </Card>
    )
  }