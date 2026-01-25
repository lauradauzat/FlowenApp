import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    // Note: Pour un MVP, on stocke le mot de passe en clair
    // TODO: Implémenter le hashage avec bcrypt dans une version future
    const user = await prisma.user.create({
      data: {
        name,
        email,
        // Pour l'instant, on ne stocke pas le mot de passe dans User
        // On utilisera un système de credentials simple
      },
    });

    // TODO: Créer un Account de type "credentials" avec le mot de passe hashé
    // Pour l'instant, on crée juste l'utilisateur

    return NextResponse.json(
      { message: "Inscription réussie", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
