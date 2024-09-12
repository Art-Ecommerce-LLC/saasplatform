import { NextAuthOptions } from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import GoogleProvider from "next-auth/providers/google"
import { decrypt } from "./utils"
import User from "../components/User"
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
            sessionToken: { label: "Session Token", type: "text" },
            "2FA_key": { label: "2FA key", type: "text" }
          },
          async authorize(credentials) {

              // Check if the credentials are valid

              // retrieve the data hidden in session token
              if (!credentials) {
                return null;
            }
              if (credentials.sessionToken) {
                  try {
                      // Decrypt the data and find the user in the database
                      const decryptedData = decrypt(decodeURIComponent(credentials.sessionToken));
                      const { userId, email } = JSON.parse(decryptedData);
                      const user = await db.user.findUnique({
                          where: { id: userId, email },
                      });
                      
                      if (!user) {
                        return null;
                    }
                    // Check the otp agains the database with the email, if it is corrrect delete it if it isn't return null
                    const storedOTP = await db.oTP.findFirst({
                      where: {
                        otp: credentials["2FA_key"],
                        expiresAt: {
                          gt: new Date(), // Only get OTPs that haven't expired
                        },
                      },
                    });
                    if (!storedOTP) {
                      return null;
                    //
                    }
                    if (new Date() > storedOTP.expiresAt) {
                      await db.oTP.delete({ where: { email } });
                      return null;
                    }

                    return {
                      id: user.id,
                      email: user.email,
                      username: user.username,
                      mfaVerified: true, 
                  }
                  } catch (error) {
                      return null;
                  }
              }
              // verify the 2FA key

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