import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import { compare } from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
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

          const { email, password } = parsed.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.error(`User not found: ${email}`);
            return null;
          }

          if (!user.passwordHash) {
            console.error(`User ${email} has no password (created before bcrypt).`);
            return null;
          }

          const ok = await compare(password, user.passwordHash);
          if (!ok) {
            console.error(`Invalid password for ${email}`);
            return null;
          }

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
  logger: {
    error(code: unknown, ...message: unknown[]) {
      // Ancien cookie (AUTH_SECRET changé) : décrypt échoue, on redirige vers /login → pas de log.
      const c = typeof code === 'string' ? code : (code as Error)?.name ?? '';
      if (c === 'JWTSessionError') return;
      console.error('[auth][error]', code, ...message);
    },
    warn(code, ...message) {
      console.warn("[auth][warn]", code, ...message);
    },
    debug(code, ...message) {
      // console.debug("[auth][debug]", code, ...message);
    },
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
