import type { DefaultSession, DefaultUser } from "next-auth"

import type { PermissionMap } from "./permission"

declare module "next-auth" {
  interface Session {
    access_token?: string
    refresh_token?: string
    permissions?: PermissionMap
    userdata?: {
      resource_id?: string | number
      full_name?: string
      email?: string
      username?: string
      role_name?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    access_token?: string
    refresh_token?: string
    permissions?: PermissionMap
    userdata?: {
      resource_id?: string | number
      full_name?: string
      email?: string
      username?: string
      role_name?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    refresh_token?: string
    permissions?: PermissionMap
    userdata?: {
      resource_id?: string | number
      full_name?: string
      email?: string
      username?: string
      role_name?: string
    }
  }
}
