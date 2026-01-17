import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

import { normalizeAbility } from "./permission"

export const authOptions: NextAuthOptions = {
  adapter: undefined, // DO NOT USE PrismaAdapter for external API

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
          })

          const json = await res.json()

          if (!res.ok) {
            throw new Error(
              JSON.stringify({
                message: 'Username atau password salah'
              })
            )
          }

          const data = json.data

          return {
            id: String(data.userdata.resource_id),
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            userdata: {
              resource_id: data.userdata.resource_id,
              full_name: data.userdata.full_name,
              email: data.userdata.email,
              username: data.userdata.username,
              role_name: data.userdata.role.role_name,
            },

            permissions: normalizeAbility(data.userdata.ability)
          }
        } catch (err) {
          return null
        }
      }
    })
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.access_token = user.access_token
        token.refresh_token = user.refresh_token
        token.userdata = user.userdata
        token.permissions = user.permissions
      }

      if (trigger === 'update' && session?.permissions) {
        token.permissions = session.permissions
      }

      return token
    },

    async session({ session, token }) {
      session.access_token = token.access_token
      session.userdata = token.userdata

      return session
    }
  },

  pages: {
    signIn: "/login"
  }
}
