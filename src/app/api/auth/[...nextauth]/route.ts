import NextAuth, { AuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import GoogleProvider from "next-auth/providers/google";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "defaultClientId",
      clientSecret: process.env.GITHUB_SECRET || "defaultSecret",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "default",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "default",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "default",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "default",
    }),
  ],

  callbacks: {
    // callbacks for token, token is what the data transfer with session
    async jwt({ user, token }) {
      if (user && user.email) {
        const mongo_user = await prisma.user.findUnique({
          where: { email: user.email },
        });
        // Note that this if condition is needed
        if (mongo_user) {
          token.user = { ...user, mongo_id: mongo_user.id };
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        // Note that this if condition is needed
        //@ts-ignore
        session.user = token.user;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
