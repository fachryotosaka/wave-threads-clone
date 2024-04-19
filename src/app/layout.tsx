import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "./providers";
import { getAuthSession } from "./api/auth/[...nextauth]/options";
import { Suspense } from "react";
import Loading from "./loading";
import FullscreenImageView from "@/components/fullscreen-image-view";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Threads App",
  description: "The Threads app to share your thoughts and much more.",
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextAuthProvider session={session}>
        {children}
        <Toaster />
        <Suspense fallback={<Loading />}>
            <FullscreenImageView />
        </Suspense>
      </NextAuthProvider>
      </body>
    </html>
  );
}
