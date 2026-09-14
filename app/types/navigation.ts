export interface NavLink {
  label: string
  href: string
  megaMenu?: MegaMenuGroup[]
}

export interface MegaMenuGroup {
  title: string
  links: MegaMenuLink[]
}

export interface MegaMenuLink {
  label: string
  href: string
  description?: string
}
