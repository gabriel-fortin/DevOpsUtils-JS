import { createContext, ReactNode, useContext, useState } from "react"


type ValueType = number | null
type ContextData = {
  workItemId: ValueType
  setWorkItemId: (_newId: ValueType) => void
}

const defaultData: ContextData = {
  workItemId: null,
  setWorkItemId: _ => console.warn("Work Item Id setter not initiialised; new value not set"),
}
const WorkItemIdContext = createContext<ContextData>(defaultData)

export function useWorkItemId(): ContextData {
  return useContext(WorkItemIdContext)
}

export const WorkItemIdContextProvider: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const [workItemId, setWorkItemId] = useState<ContextData["workItemId"]>(null)

    return (
      <WorkItemIdContext.Provider value={{ workItemId, setWorkItemId }}>
        {children}
      </WorkItemIdContext.Provider>
    )
  }

export const IfWorkItemIdIsSet: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const { workItemId } = useWorkItemId()
    if (!workItemId) return null
    return children
  }
