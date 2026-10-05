import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@next-auth/prisma-adapter" // Will be added when prisma is instantiated

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mock authorization for now until DB is connected
        if (credentials?.email === "admin@platform.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Super Admin",
            email: "admin@platform.com",
            role: "SUPER_ADMIN"
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  }
}
