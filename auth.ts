import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && profile?.sub) {
        token.googleId = profile.sub; // Real Google user ID
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.googleId as string;
      }
      return session;
    },
  },
})