import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string | null
    mfaVerified: boolean | null
  }
  interface Session {
    user: User & {
        username: string
        mfaVerified: boolean
    }
    token: {
        username: string
    }
  }
}