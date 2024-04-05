import { useMemo } from "react"

import { usePersonalAccessToken } from "@/auth/PersonalAccessTokenHolder"
import { API_VERSION } from "@/constants"


export function useDevOpsGet(url: string): Request {
  const pat = usePersonalAccessToken()

  return useMemo<Request>(() => {
    const joinChar = url.includes("?") ? "&" : "?"
    const request = new Request(`${url}${joinChar}${API_VERSION}`)

    const auth = `Basic ${btoa(":" + pat)}`
    request.headers.append("Authorization", auth)

    request.headers.append("Accept", "application/json")
    return request
  }, [url, pat])
}
