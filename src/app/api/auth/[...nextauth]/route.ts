import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import GoogleProvider from "next-auth/providers/google";
const handler = NextAuth({
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
    // ...add more providers here
  ],
  session: {
    //jwt: true,
  },
  callbacks: {
    // callbacks for token, token is what the data transfer with session
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
