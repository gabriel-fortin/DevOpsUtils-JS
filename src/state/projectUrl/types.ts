export type UrlType = string | null
export type UrlSetterType = (projectUrl: UrlType) => void

export type ContextType = {
    value: UrlType
    setter: UrlSetterType
}
