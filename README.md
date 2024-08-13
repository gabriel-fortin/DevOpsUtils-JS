This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## `SWR` and fetchers

This project uses `SWR` and builds an infrastructure on top of it to make the 
different steps of fetching logic split into independent chunks. Each place in 
the app might require a different combination of those chunks. Those chunks 
are called "middleware" and mostly behave the way you would expect middleware 
to behave. However, each middleware can set up two elements. One is the 
pipeline of the request - creating the request and consuming the response 
(standard middleware stuff). The other is building the key used in calls to 
`SWR`. Building the key correctly ensures that re-fetching happens when 
data relevant to how a request is made changes.

### Rules of fetcher middleware

~~It is not allowed to change the existing values in the key array. Only to add 
new ones. Otherwise that would influence the behaviour of other middleware 
which would break the single responsibility and encapsulation principles.~~

The key will be an array of strings. The first element in the array will 
always be the URL to be used in the request. Additional items can be added 
to that array.

If the middleware adds a value to the key array, the fetch pipeline part of the 
middleware has to remove that value from the array before passing the array 
to the next middleware.