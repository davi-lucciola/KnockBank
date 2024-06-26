import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "@/modules/auth/contexts/auth-context";
import { AccountContextProvider } from "@/modules/account/contexts/account-context";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "KnockBank",
  description: "Home page for create an account or login in a existing account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
      <AccountContextProvider>
        <html lang="en">
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              roboto.variable
            )}
          >
            {children}
            <Toaster />
          </body>
        </html>
      </AccountContextProvider>
    </AuthContextProvider>
  );
}
