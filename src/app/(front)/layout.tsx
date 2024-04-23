import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "../providers";
import BaseComponent from "@/components/base/BaseComponent";
import Loading from "@/components/common/loading";
import { Suspense } from "react";
import FullscreenImageView from "@/components/fullscreen-image-view";
import { getAuthSession } from "../api/auth/[...nextauth]/options";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Wave",
  description: "The Threads Clone app to share your thoughts and much more.",
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  return (
    <NextAuthProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <BaseComponent>{children}</BaseComponent>
        <Toaster />
      </ThemeProvider>
  </NextAuthProvider>
  );
}
