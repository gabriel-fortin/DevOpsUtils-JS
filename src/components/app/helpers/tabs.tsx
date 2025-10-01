import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"


const TabStateContext = createContext<[
  Record<string, boolean>,
  React.Dispatch<React.SetStateAction<Record<string, boolean>>>
]>([{}, () => { }])

type TabsCollectionHook = {
  registerTab: (_label: string) => void
  unregisterTab: (_label: string) => void
  activateTab: (_label: string) => void
  isTabActive: (_label: string) => boolean
}
const useTabsCollection: () => TabsCollectionHook =
  () => {
    const [tabCollection, setTabCollection] = useContext(TabStateContext)

    const registerTab = useCallback((label: string) => {
      setTabCollection(prevCollection => {
        if (label in prevCollection) return prevCollection // already registered

        if (Object.keys(prevCollection).length === 0) {
          return { [label]: true }
        }
        return {
          ...prevCollection,
          [label]: false,
        }
      })
    }, [setTabCollection])

    const unregisterTab = useCallback((label: string) => {
      setTabCollection(prev => {
        const updated = { ...prev }
        delete updated[label]
        return updated
      })
    }, [setTabCollection])

    const activateTab = useCallback((label: string) => {
      setTabCollection(prevCollection => {
        return Object.keys(prevCollection)
          .reduce((acc, key) => {
            acc[key] = key === label
            return acc
          }, {} as Record<string, boolean>)
      })
    }, [setTabCollection])

    const isTabActive = useCallback((label: string) => {
      return tabCollection[label] ?? false
    }, [tabCollection])

    return { registerTab, unregisterTab, activateTab, isTabActive }
  }


export const TabContainer: React.FC<{
  children?: ReactNode[]
}> = ({
  children
}) => {
    const tabState = useState<Record<string, boolean>>({})

    return (
      <TabStateContext.Provider value={tabState}>
        <div role="tablist" className="tabs tabs-lift">
          {children}
        </div>
      </TabStateContext.Provider>
    )
  }

export const Tab: React.FC<{
  label: string
  hasDot?: boolean | ((_isCurrent: boolean) => boolean)
  children?: React.ReactNode
}> = ({
  label,
  hasDot: hasDotRaw = false,
  children,
}) => {
    const { registerTab, unregisterTab, activateTab, isTabActive } = useTabsCollection()
    const isActive = isTabActive(label)
    const hasDot = typeof hasDotRaw === "function" ? hasDotRaw(isActive) : hasDotRaw

    useEffect(() => {
      registerTab(label)
      // if we ever want to dynamically change tabs, we need to unregister on unmount
      return () => unregisterTab(label)
    }, [label, registerTab, unregisterTab])

    return (
      <>
        <span role="tab"
          className={`tab indicator ${isActive && "tab-active"}`}
          onClick={() => activateTab(label)}
        >
          {hasDot &&
            <span className="mt-1
                            indicator-item indicator-center
                            status status-accent status-lg
                            animate-pulse font-bold" />
          }
          <span className="">
            {label}
          </span>
        </span>
        <div className="tab-content p-3 bg-base-100 border-(--color-base-300)">
          {children}
        </div>
      </>
    )
  }