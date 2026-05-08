import type { DefaultSession, DefaultUser } from "next-auth"

import type { PermissionMap } from "./permission"

declare module "next-auth" {
  interface Session {
    access_token?: string
    userdata?: {
      full_name?: string
      email?: string
      role_name?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    access_token?: string
    permissions?: PermissionMap
    userdata?: {
      full_name?: string
      email?: string
      role_name?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    permissions?: PermissionMap
    userdata?: {
      full_name?: string
      email?: string
      role_name?: string
    }
  }
}
