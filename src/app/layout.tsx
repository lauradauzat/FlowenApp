import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ConditionalHeader } from "@/components/layout/ConditionalHeader";

export const metadata: Metadata = {
  title: "Flowen App",
  description: "Application de gestion pour musiciens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <ConditionalHeader />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
