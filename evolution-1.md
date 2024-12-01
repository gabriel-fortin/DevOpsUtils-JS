A summary of the first (documented) big changes in the app.


## Before the first global reshuffle

Reorganise project from being grouped by feature to being grouped in layers.

Motivation: some data access functions or state functions were used from multiple 
featurese resulting in a considerable amount of cross-feature dependencies.

Note: some less interesting elements were omitted in the diagrams

```mermaid
graph LR
    SelectWorkItem --> useWorkItemId

    PatAuth --> useAnyCall
    PatAuth --> usePatStorage
    PatAuth --> usePersonalAccessToken
    useAnyCall --> usePreconfiguredFetcher
    useAnyCall --> patAuthMiddleware
    usePatStorage --> useProjectUrl
    
    WorkItemAndItsChildren --> DisplayWorkItem
    WorkItemAndItsChildren --> useFetchWorkItem
    WorkItemAndItsChildren --> useWorkItemId
    DisplayWorkItem --> useFetchWorkItem
    useFetchWorkItem --> usePreconfiguredFetcher
    useFetchWorkItem --> workItemDtoResponseMiddleware

    usePreconfiguredFetcher --> useProjectUrl
    usePreconfiguredFetcher --> usePersonalAccessToken
    usePreconfiguredFetcher --> useBasicComposableFetcher
    usePreconfiguredFetcher --> patAuthMiddleware
    usePreconfiguredFetcher --> projectUrlMiddleware
    usePreconfiguredFetcher --> apiVersionMiddleware

    SelectProjectUrl --> useProjectUrl
    SelectProjectUrl --> useProjectUrlRepository
    useProjectUrl --> ProjectUrlContext
    ProjectUrlContextProvider --> ProjectUrlContext

    usePersonalAccessToken --> PersonalAccessTokenContext
    PersonalAccessTokenContextProvider --> PersonalAccessTokenContext

    useWorkItemId --> WorkItemIdContext
    WorkItemIdContextProvider --> WorkItemIdContext

    AddTasks --> useWorkItemId
    AddTasks --> TaskItem
    TaskItem --> useFetchWorkItem
    TaskItem --> useAddTaskToWorkItem
    useAddTaskToWorkItem --> usePreconfiguredFetcher
    useAddTaskToWorkItem --> useProjectUrl
    useAddTaskToWorkItem --> addTaskMiddleware

    App --> AddTasks
    App --> PatAuth
    App --> PersonalAccessTokenContextProvider
    App --> usePersonalAccessToken
    App --> ProjectUrlContextProvider
    App --> useProjectUrl
    App --> SelectProjectUrl
    App --> useWorkItemId
    App --> WorkItemIdContextProvider
    App --> SelectWorkItem
    App --> WorkItemAndItsChildren

    subgraph root
        App
    end
    subgraph adding tasks
        AddTasks
        TaskItem
        useAddTaskToWorkItem
        addTaskMiddleware
    end
    subgraph auth
        PatAuth
        useAnyCall
        patAuthMiddleware
        usePatStorage
    end
    subgraph contexts
        useWorkItemId
        WorkItemIdContextProvider
        WorkItemIdContext
        usePersonalAccessToken
        PersonalAccessTokenContextProvider
        PersonalAccessTokenContext
    end
    subgraph networking
        usePreconfiguredFetcher
        useBasicComposableFetcher
        patAuthMiddleware
        projectUrlMiddleware
        apiVersionMiddleware
    end
    subgraph select Project Url
        SelectProjectUrl
        ProjectUrlContext
        ProjectUrlContextProvider
        useProjectUrl
        useProjectUrlRepository
    end
    subgraph select Work Item
        SelectWorkItem
    end
    subgraph show work items
        DisplayWorkItem
        WorkItemAndItsChildren
        useFetchWorkItem
        workItemDtoResponseMiddleware
    end
```

## After grouping code into layers rather than features

There are less dependencies between groups.

```mermaid
graph LR
    subgraph network
        usePreconfiguredFetcher
        useBasicComposableFetcher
        patAuthMiddleware
        projectUrlMiddleware
        apiVersionMiddleware
    end
    subgraph state
        useProjectUrl
        ProjectUrlContextProvider
        ProjectUrlContext
        usePersonalAccessToken
        PersonalAccessTokenContextProvider
        PersonalAccessTokenContext
        useWorkItemId
        WorkItemIdContextProvider
        WorkItemIdContext
    end
    subgraph data access
        useProjectUrlStorage
        useWorkItemCall
            workItemDtoResponseMiddleware
        usePatStorage
        useAddTaskCall
            addTaskMiddleware
        useAnythingUsingPatCall
    end
    subgraph components
        App
        PatAuth
        SelectProjectUrl
        SelectWorkItem
        subgraph adding tasks
            AddTasks
            TaskItem
        end
        subgraph showing work items
            WorkItemAndItsChildren
            DisplayWorkItem
        end
    end

    PatAuth --> useProjectUrlStorage
    PatAuth --> usePatStorage
    PatAuth --> usePersonalAccessToken
    useProjectUrlStorage --> usePreconfiguredFetcher
    useProjectUrlStorage --> patAuthMiddleware
    usePatStorage --> useProjectUrl
    
    SelectWorkItem --> useWorkItemId

    WorkItemAndItsChildren --> DisplayWorkItem
    WorkItemAndItsChildren --> useWorkItemCall
    WorkItemAndItsChildren --> useWorkItemId
    DisplayWorkItem --> useWorkItemCall
    useWorkItemCall --> usePreconfiguredFetcher
    useWorkItemCall --> workItemDtoResponseMiddleware

    subgraph network
        usePreconfiguredFetcher --> useProjectUrl
        usePreconfiguredFetcher --> usePersonalAccessToken
        usePreconfiguredFetcher --> useBasicComposableFetcher
        usePreconfiguredFetcher --> patAuthMiddleware
        usePreconfiguredFetcher --> projectUrlMiddleware
        usePreconfiguredFetcher --> apiVersionMiddleware
    end

    SelectProjectUrl --> useProjectUrl
    SelectProjectUrl --> useProjectUrlStorage
    useProjectUrl --> ProjectUrlContext
    ProjectUrlContextProvider --> ProjectUrlContext

    usePersonalAccessToken --> PersonalAccessTokenContext
    PersonalAccessTokenContextProvider --> PersonalAccessTokenContext

    useWorkItemId --> WorkItemIdContext
    WorkItemIdContextProvider --> WorkItemIdContext

    AddTasks --> useWorkItemId
    AddTasks --> TaskItem
    TaskItem --> useWorkItemCall
    TaskItem --> useAddTaskCall
    useAddTaskCall --> usePreconfiguredFetcher
    useAddTaskCall --> useProjectUrl
    useAddTaskCall --> addTaskMiddleware

    App --> AddTasks
    App --> PatAuth
    App --> PersonalAccessTokenContextProvider
    App --> usePersonalAccessToken
    App --> ProjectUrlContextProvider
    App --> useProjectUrl
    App --> SelectProjectUrl
    App --> useWorkItemId
    App --> WorkItemIdContextProvider
    App --> SelectWorkItem
    App --> WorkItemAndItsChildren
```


## After removing dependencies between 'data access' and 'state' layers.

Dependencies look more unidirectional.

```mermaid
graph LR
    subgraph network
        usePreconfiguredFetcher
        useBasicComposableFetcher
        patAuthMiddleware
        projectUrlMiddleware
        apiVersionMiddleware
    end
    subgraph state
        useProjectUrl
        ProjectUrlContextProvider
        ProjectUrlContext
        usePersonalAccessToken
        PersonalAccessTokenContextProvider
        PersonalAccessTokenContext
        useWorkItemId
        WorkItemIdContextProvider
        WorkItemIdContext
    end
    subgraph data access
        useProjectUrlStorage
        useWorkItemCall
            workItemDtoResponseMiddleware
        usePatStorage
        useAddTaskCall
            addTaskMiddleware
        useAnythingUsingPatCall
    end
    subgraph components
        App
        subgraph PAT
            PatAuth
            usePathAuthLogic
        end
        SelectProjectUrl
        SelectWorkItem
        subgraph adding tasks
            AddTasks
            TaskItem
            useTaskItemLogic
        end
        subgraph showing work items
            WorkItemAndItsChildren
            DisplayWorkItem
        end
    end

    PatAuth --> usePathAuthLogic
    useProjectUrlStorage --> usePreconfiguredFetcher
    useProjectUrlStorage --> patAuthMiddleware
    usePathAuthLogic --> usePatStorage
    usePathAuthLogic --> useProjectUrl
    
    SelectWorkItem --> useWorkItemId

    WorkItemAndItsChildren --> DisplayWorkItem
    WorkItemAndItsChildren --> useWorkItemCall
    WorkItemAndItsChildren --> useWorkItemId
    DisplayWorkItem --> useWorkItemCall
    useWorkItemCall --> usePreconfiguredFetcher
    useWorkItemCall --> workItemDtoResponseMiddleware

    subgraph network
        usePreconfiguredFetcher --> useProjectUrl
        usePreconfiguredFetcher --> usePersonalAccessToken
        usePreconfiguredFetcher --> useBasicComposableFetcher
        usePreconfiguredFetcher --> patAuthMiddleware
        usePreconfiguredFetcher --> projectUrlMiddleware
        usePreconfiguredFetcher --> apiVersionMiddleware
    end

    SelectProjectUrl --> useProjectUrl
    SelectProjectUrl --> useProjectUrlStorage
    useProjectUrl --> ProjectUrlContext
    ProjectUrlContextProvider --> ProjectUrlContext

    usePersonalAccessToken --> PersonalAccessTokenContext
    PersonalAccessTokenContextProvider --> PersonalAccessTokenContext

    useWorkItemId --> WorkItemIdContext
    WorkItemIdContextProvider --> WorkItemIdContext

    AddTasks --> useWorkItemId
    AddTasks --> TaskItem
    TaskItem --> useTaskItemLogic
    useTaskItemLogic --> useWorkItemCall
    useTaskItemLogic --> useAddTaskCall
    useAddTaskCall --> usePreconfiguredFetcher
    useAddTaskCall --> addTaskMiddleware

    App --> AddTasks
    App --> PatAuth
    App --> PersonalAccessTokenContextProvider
    App --> usePersonalAccessToken
    App --> ProjectUrlContextProvider
    App --> useProjectUrl
    App --> SelectProjectUrl
    App --> useWorkItemId
    App --> WorkItemIdContextProvider
    App --> SelectWorkItem
    App --> WorkItemAndItsChildren
```
