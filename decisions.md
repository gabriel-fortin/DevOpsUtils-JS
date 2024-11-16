
Imports
------------------------------------------------------------

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

**Contexts**
Contexts will have a shape similar to the below:
```
{
  value: ValueType
  setter: (_:VaueType) => void
}
```
Field names are encouraged to be function-specific.

