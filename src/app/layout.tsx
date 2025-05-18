import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Flowout Interview Task",
  description: "Created by Armin Rejzovic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={inter.className}>
      <body className={"bg-[#f0f3f4]"}>{children}</body>
    </html>
  );
}
