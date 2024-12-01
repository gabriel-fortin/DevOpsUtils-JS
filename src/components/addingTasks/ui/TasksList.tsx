import { FC } from "react"

import { Task } from "@/dataAccess/addTask"
import { useWorkItemId } from "@/state/workItemId"

import { TaskItem } from "./TaskItem"


export const TasksList: FC<{
  tasks: Task[]
  events: EventTarget
}> = ({
  tasks,
  events,
}) => {
    const { workItemId: parentWorkItemId } = useWorkItemId()

    if (!parentWorkItemId) return "No parent work item selected"

    return tasks.map(task =>
      <TaskItem key={task.getTitle()}
        parentWorkItemId={parentWorkItemId}
        task={task}
        events={events}
      />
    )
  }