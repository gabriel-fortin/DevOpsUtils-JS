import { useMemo } from "react"

import { API_VERSION } from "@/constants"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"


export function useDevOpsGet(url: string, patOverride?: string): Request {
  const pat = usePersonalAccessToken()

  return useMemo<Request>(() => {
    const joinChar = url.includes("?") ? "&" : "?"
    const request = new Request(`${url}${joinChar}${API_VERSION}`)

    const auth = `Basic ${btoa(":" + (patOverride ?? pat))}`
    request.headers.append("Authorization", auth)

    request.headers.append("Accept", "application/json")
    return request
  }, [url, pat, patOverride])
}
