import { useEffect, useState } from "react"

import { useAnythingUsingPatCall, usePatStorage } from "@/dataAccess/personalAccessToken"
import { usePersonalAccessToken } from "@/state/personalAccesssToken"


type StateType = "EMPTY" | "FETCHING" | "YES" | "NOPE"

type HookType = (_requiresAttention: boolean) => {
  state: StateType
  currentPatInput: string
  setCurrentPatInput: (_pat: string) => void
  savePat: () => void
  loadPat: () => void
  isAutoLoad: boolean
  toggleAutoLoad: () => void
  isHighlight: boolean
  isSaveVisible: boolean
  isLoadVisible: boolean
}

export const usePathAuthLogic: HookType =
  (requiresAttention) => {
    // internal things
    const [currentPatInput, setCurrentPatInput] = useState("")
    const [state, setState] = useState<StateType>("EMPTY")
    const [isAutoLoad, setIsAutoLoad] = useState(true)

    // external things
    const [patInStorage, savePatToStorage] = usePatStorage()
    const { patSetter: sendPatToTheRestOfTheApp } = usePersonalAccessToken()
    const { data: response, isLoading } = useAnythingUsingPatCall(currentPatInput)

    useEffect(() => {
      if (isLoading) {
        setState("FETCHING")
      } else if (!currentPatInput) {
        setState("EMPTY")
      } else if (response?.status === 200) {
        sendPatToTheRestOfTheApp(currentPatInput)
        setState("YES")
      } else { // Pat entered but its validation failed
        sendPatToTheRestOfTheApp("")
        setState("NOPE")
      }
    }, [isLoading, sendPatToTheRestOfTheApp, currentPatInput, response])

    useEffect(() => {
      if (isAutoLoad) {
        setCurrentPatInput(patInStorage)
        if (!patInStorage) {
          sendPatToTheRestOfTheApp("")
        }
      }
    }, [isAutoLoad, patInStorage, sendPatToTheRestOfTheApp])

    const loadPat = () => {
      setCurrentPatInput(patInStorage)
    }
    const savePat = () => {
      // don't save a PAT that didn't lead to a successful response
      if (state !== "YES") return

      savePatToStorage(currentPatInput)
    }
    const toggleAutoLoad = () => {
      setIsAutoLoad(!isAutoLoad)
    }

    const isHighlight = requiresAttention && !currentPatInput
    const isSaveVisible = !!currentPatInput
    const isLoadVisible = !!patInStorage

    return {
      state,
      currentPatInput,
      setCurrentPatInput,
      savePat,
      loadPat,
      isAutoLoad,
      toggleAutoLoad,
      isHighlight,
      isSaveVisible,
      isLoadVisible,
    }
  }
