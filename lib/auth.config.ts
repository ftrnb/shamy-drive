import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Config "légère" : PAS de Prisma ici, PAS de bcrypt.
// C'est cette version qui est utilisée par le middleware (Edge Runtime),
// donc elle ne doit importer que des choses compatibles Edge.
export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize() ici n'est jamais vraiment appelé côté middleware,
      // mais next-auth exige que le provider soit déclaré.
      // La vraie logique (avec Prisma) est dans auth.ts.
      authorize: async () => null,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;