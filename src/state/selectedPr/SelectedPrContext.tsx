import { createContext, ReactNode, useContext, useState } from "react"

import { PullRequestDto } from "@/dataAccess/pullRequest"


type ValueType = PullRequestDto | null
type ContextData = {
  selectedPr: ValueType
  setSelectedPr: (_newDto: ValueType) => void
}

const defaultData: ContextData = {
  selectedPr: null,
  setSelectedPr: _ => console.warn("Selected PR Id setter not initialised; new value not set"),
}
const SelectedPrContext = createContext<ContextData>(defaultData)

export function useSelectedPr(): ContextData {
  return useContext(SelectedPrContext)
}

export const SelectedPrContextProvider: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const [selectedPr, setSelectedPr] = useState<ValueType>(null)

    return (
      <SelectedPrContext.Provider value={{ selectedPr: selectedPr, setSelectedPr }}>
        {children}
      </SelectedPrContext.Provider>
    )
  }

export const WhenSelectedPrExists: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const { selectedPr } = useSelectedPr()
    if (selectedPr == null) return null
    return children
  }

export const WhenSelectedPrIsNull: React.FC<{
  children: ReactNode
}> = ({
  children,
}) => {
    const { selectedPr } = useSelectedPr()
    if (selectedPr != null) return null
    return children
  }
