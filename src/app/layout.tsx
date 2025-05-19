import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/app/providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Flowout Test Task",
  description: "Created by Armin Rejzovic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={inter.className}>
        <body className={"bg-[#f0f3f4]"}>
            <Providers>
                {children}
            </Providers>
        </body>
    </html>
  );
}
