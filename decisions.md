
Imports
============================================================

**Root alias**
Paths for project-local imports are rooted in the `src` directory. This 
directory is aliased as `@`, for example:

`import { AddTasks } from "@/addingTasks/AddTasks"`

That works thanks to the following config in the `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Imports' order**
Imports in a file are sorted into the following groups:
- imports from external packages
- imports from other components/features in the project
- imports from other files in the component/feature, those should be in the 
same directory



Project structure
============================================================

`state` – state of the application (while it runs)  
does not depend on anything (except libraries and browser methods)  

`network` – basic and intermediate building blocks for network operations  
basic blocks don't depend on anything (except libraries and browser methods)  
intermediate blocks can depend on `state`  

`dataAccess` – general access to data  
methods having "Call" suffix provide access to data over the network and depend on `network`  
methods having "Storage" suffix provide access to some kind of local storage

`components` – UI components



Other
============================================================

**Contexts**
Contexts will have a shape similar to the below:
```
{
  value: ValueType
  setter: (_:VaueType) => void
}
```
Field names are encouraged to be function-specific, e.g. `patValue`, `patSetter`.
