import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "defaultClientId",
      clientSecret: process.env.GITHUB_SECRET || "defaultSecret",
    }),
    // ...add more providers here
  ],
});

export { handler as GET, handler as POST };
