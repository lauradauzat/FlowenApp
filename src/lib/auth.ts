import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Pas d'adapter Prisma avec JWT strategy + Credentials provider
  // L'adapter Prisma est uniquement pour session strategy "database"
  session: {
    strategy: "jwt", // JWT requis pour Credentials provider
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error("Invalid credentials format:", parsed.error);
            return null;
          }

          const { email } = parsed.data;

          // Pour le MVP, on vérifie simplement que l'utilisateur existe
          // TODO: Implémenter la vérification de mot de passe avec bcrypt
          // Pour l'instant, on accepte n'importe quel mot de passe si l'utilisateur existe
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.error(`User not found: ${email}`);
            return null;
          }

          console.log(`User found: ${user.email}, logging in...`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Lors de la première connexion, user est défini
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Passer les données du token à la session
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
