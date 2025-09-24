import { AddTasks } from "@/components/addingTasks"
import { SelectWorkItem } from "@/components/selectWorkItem"
import { WorkItemAndItsChildren } from "@/components/showWorkItems"

import { usePersonalAccessToken } from "@/state/personalAccesssToken"
import { useProjectUrl } from "@/state/projectUrl"
import { IfWorkItemIdIsSet, useWorkItemId } from "@/state/workItemId"

import { Tab } from "../helpers/tabs"
import Card from "../helpers/Card"


export const WorkItemTab: React.FC =
  () => {
    return (
      <Tab label="Work item">
        <div className="flex gap-8">
          <div className="grow flex flex-col gap-8 max-w-[30em]">
            <SelectWorkItemCard />
            <AddTasksCard />
          </div>
          <div className="grow">
            <WorkItemAndItsChildrenCard />
          </div>
        </div>
      </Tab>
    )
  }

const SelectWorkItemCard: React.FC =
  () => {
    const { projectUrl } = useProjectUrl()
    const { patValue } = usePersonalAccessToken()
    const { workItemId } = useWorkItemId()

    const requiresAttention = !!projectUrl && !!patValue && !workItemId

    return (
      <Card isHighlighted={requiresAttention}>
        <SelectWorkItem requiresAttention={requiresAttention} />
      </Card>
    )
  }

const AddTasksCard: React.FC =
  () => {
    return (
      <IfWorkItemIdIsSet>
        <Card>
          <div className="-my-3">
            <AddTasks />
          </div>
        </Card>
      </IfWorkItemIdIsSet>
    )
  }

const WorkItemAndItsChildrenCard: React.FC =
  () => {
    return (
      <IfWorkItemIdIsSet>
        <Card>
          <WorkItemAndItsChildren />
        </Card>
      </IfWorkItemIdIsSet>
    )
  }