import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/store-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PermissionBootstrap } from "@/components/providers/permission-bootstrap";
import { FloatingChatbot } from "@/components/layout/floating-chatbot";
import { LanguageProvider } from "@/components/providers/language-provider";
import { OnboardingOverlay } from "@/components/layout/onboarding-overlay";
import { SosOverlay } from "@/components/layout/sos-overlay";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Animal Rescue Connect",
  description: "Emergency Help Platform for Stray & Sick Animals",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-muted/20 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <LanguageProvider>
              <div id="mobile-layout-container" className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-xl relative pb-16 border-x border-muted">
                <OnboardingOverlay />
                <SosOverlay />
                <Header />
                <main className="flex-1 flex flex-col">{children}</main>
                <BottomNav />
                <FloatingChatbot />
              </div>
              <PermissionBootstrap />
              <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
              />
            </LanguageProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
