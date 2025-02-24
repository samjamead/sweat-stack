import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sweat Stack",
  description:
    "Sweat Stack is a tool for tracking your Strava activities and visualising your progress over time.",
};

const appWidth = "max-w-lg md:max-w-xl lg:max-w-4xl";
const bodyGutter = "px-3";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <QueryProvider>
          <div className="flex min-h-svh flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <Header maxWidth={appWidth} bodyGutter={bodyGutter} />
              <div className={cn(bodyGutter)}>
                <div className={cn("mx-auto w-full", appWidth)}>{children}</div>
              </div>
            </div>
            <Footer maxWidth={appWidth} bodyGutter={bodyGutter} />
          </div>
        </QueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
