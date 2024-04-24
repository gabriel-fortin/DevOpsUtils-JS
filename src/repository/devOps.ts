import { useMemo } from "react"

import { API_VERSION } from "@/config"
import { usePersonalAccessToken } from "@/contexts/PersonalAccessTokenContext"


export function useDevOpsGet(url: string, patOverride?: string): Request {
  const pat = usePersonalAccessToken()

  return useMemo<Request>(() => {
    const request = new Request(withApiVersion(url))
    addAuth(request, patOverride ?? pat)
    request.headers.append("Accept", "application/json")
    return request
  }, [url, pat, patOverride])
}

export function useDevOpsPost(url: string): Request {
  const pat = usePersonalAccessToken()

  return useMemo<Request>(() => {
    const request = new Request(withApiVersion(url), {
      method: "POST",
    })
    addAuth(request, pat)
    request.headers.append("Content-Type", "application/json-patch+json")
    return request
  }, [pat, url])
}

function addAuth(request: Request, pat: string): void {
  const auth = `Basic ${btoa(":" + pat)}`
  request.headers.append("Authorization", auth)
}

function withApiVersion(url: string): string {
  const joinChar = url.includes("?") ? "&" : "?"
  return `${url}${joinChar}${API_VERSION}`
}
