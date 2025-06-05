A set of little tools to make my life easier with Azure DevOps

## `SWR` and fetchers

This project uses `SWR` and builds an infrastructure on top of it to make the 
different steps of making a request and consuming a response separated into 
request/response transformers called "middleware". The motivation is that each 
place in the app may require a different combination of middleware. The notion 
of middleware is widely understood and this project meets a developer's 
expectations of what it does.

In addition to middleware, when building a request, it's possible to provide 
an additional bit of info to the key provided to SWR. It results in SWR being better 
informed of when a request's dependency change - when to re-make a request.

Additionally, using SWR allows to de-duplicate requests coming from different 
components. When the same resource is requested by multiple components, SWR 
will make only one request and share the result with all requestors.
