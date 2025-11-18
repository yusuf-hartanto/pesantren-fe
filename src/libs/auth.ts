import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

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

          const {data: data} = await res.json()

          if (!res.ok) return null

          return data
        } catch (err) {
          return null
        }
      }
    })
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token
        token.refresh_token = user.refresh_token
        token.userdata = user.userdata
      }

      return token
    },

    async session({ session, token }) {
      session.access_token = token.access_token
      session.refresh_token = token.refresh_token
      session.userdata = token.userdata

      return session
    }
  },

  pages: {
    signIn: "/login"
  }
}
