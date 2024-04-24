import { BASE_URL } from "@/config"
import { useDevOpsPost } from "@/repository/devOps"

import { SelectableTask } from "./tasks"


export function useNetworkOperations() {
  const request = useDevOpsPost(`${BASE_URL}/wit/workitems/$Task`)
  return {
    postChildTasksToDevOps: postChildTasks(request)
  }
}

const postChildTasks =
  (request: Request) =>
    (workItemId: number, tasks: SelectableTask[]) => {
      return tasks
        .map(task => preparePostData(workItemId, task))
        .map(postData =>
          fetch(request, {
            body: JSON.stringify(postData),
          })
        )
    }

function preparePostData(workItemId: number, task: SelectableTask) {
  const postData = [
    {
      op: "add",
      path: "/fields/System.Title",
      from: null,
      value: task.getTitle(),
    },
    {
      op: "add",
      path: "/relations/-",
      from: null,
      value: {
        rel: "System.LinkTypes.Hierarchy-Reverse",
        url: `${BASE_URL}/wit/workItems/${workItemId}`,
      },
    },
  ]
  return postData
}