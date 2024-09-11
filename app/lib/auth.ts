import { NextAuthOptions } from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages : {
        signIn : "/sign-in",
    },
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
          name: "Credentials",

          credentials: {
            "2FA_key": { label: "2FA key", type: "text" }
          },
          async authorize(credentials) {
            
              if (!credentials) {
                  return null;
              }
              try {
                const validOTP = await fetch(`${process.env.NEXTAUTH_URL}/api/emailmfa`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      otp: credentials["2FA_key"],
                  }),
              });
              const validOTPData = await validOTP.json();
                            

              if (validOTPData?.error) {
                  return null
              }
              return {
                  id: validOTPData.user.id,
                  email: validOTPData.user.email,
                  username: validOTPData.user.username,
                  mfaVerified: true, 
              }
              } catch (error) {
                  return null;
              }
          }
        })
      ],
      callbacks: {
        async jwt({token, user}) {
            if (user){
                return {
                    ...token,
                    username: user.username,
                    mfaVerified: user.mfaVerified
                }
            }
             return token
        },
        async session({session, token}) {
          return {
            ...session,
            user: {
                ...session.user,
                username: token.username,
                mfaVerified: token.mfaVerified
            }
          }
        }
      }
}