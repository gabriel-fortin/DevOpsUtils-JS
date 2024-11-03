import { FC } from "react"

import { useWorkItemIdValue } from "@/contexts/WorkItemIdContext"

import { TaskItem } from "./TaskItem"
import { Task } from "../task"


export const TasksList: FC<{
    tasks: Task[]
    events: EventTarget
  }> = ({
    tasks,
    events,
  }) => {
      const parentWorkItemId = useWorkItemIdValue()
  
      if (!parentWorkItemId) return "No parent work item selected"
  
      return tasks.map(task =>
        <TaskItem key={task.name}
          parentWorkItemId={parentWorkItemId}
          task={task}
          events={events}
        />
      )
    }