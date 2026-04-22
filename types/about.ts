export interface ContactItem {
  label: string
  email: string
}

export interface PlatformItem {
  label: string
  url: string
}

export interface About {
  _id: string
  studioText?: any[]
  services?: { title: string }[]
  clients?: string[]
  offices?: string[]
  contact?: ContactItem[]
  platforms?: PlatformItem[]
}