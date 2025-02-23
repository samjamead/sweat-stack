import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { cn } from "@/lib/utils";

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
  title: "Next 15 Starter Repo",
  description:
    "Opinionated starter repo for Next.js 15, with TypeScript, Tailwind and ShadCN",
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
        <div className="flex min-h-svh flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Header maxWidth={appWidth} bodyGutter={bodyGutter} />
            <div className={cn(bodyGutter)}>
              <div className={cn("mx-auto w-full", appWidth)}>{children}</div>
            </div>
          </div>
          <Footer maxWidth={appWidth} bodyGutter={bodyGutter} />
        </div>

        <Toaster />
      </body>
    </html>
  );
}
