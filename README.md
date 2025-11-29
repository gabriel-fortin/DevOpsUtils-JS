A set of little tools to make my life easier with Azure DevOps

## Project structure

- `components/` – UI components and related logic
- `dataAccess/` – functions (and supporting constructs) to manage data 
  either over the network or in local persistence
- `network` – primitives to make network calls using SWR
- `state` – storing and exposing application-wide state


## Naming convention

- Hooks of the form `useXXCall` make network requests to the DevOps's API.
- Hooks of the form `useXXStorage` give access to local persistence.
- Objects called `XXMiddleware` are middleware that can be used with
  the fetcher system implemented in this project.


## `SWR` and fetchers

This project uses `SWR` and builds an infrastructure on top of it to make the 
different steps of making a request and consuming a response separated into 
request/response transformers called "middleware". The motivation is that each 
place in the app may require a different combination of middleware. The notion 
of middleware is widely understood in the software worls and this project meets 
a developer's expectations of what it does.

In addition to middleware, when building a request, it's possible to provide 
an additional bit of info that will be added to the SWR key. It results in SWR being better 
informed of when a request's dependency changes - thus when to re-fetch a resource.

Additionally, using SWR allows to de-duplicate requests coming from different 
components. When the same resource is requested by multiple components, SWR 
will make only one request and share the result with all requestors.
