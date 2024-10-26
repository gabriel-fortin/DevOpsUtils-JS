export type UrlType = string
export type UrlSetterType = (projectUrl: UrlType) => void

export type ContextType = {
    value: UrlType
    setter: UrlSetterType
}
