import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    access_token?: string
    refresh_token?: string
    userdata?: {
      resource_id?: string | number
      full_name?: string
      email?: string
      username?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    access_token?: string
    refresh_token?: string
    userdata?: {
      resource_id?: string | number
      full_name?: string
      email?: string
      username?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    refresh_token?: string
    userdata?: {
      resource_id?: string | number
      full_name?: string
      email?: string
      username?: string
    }
  }
}
