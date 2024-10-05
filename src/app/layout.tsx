"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/soho-light/theme.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { RecoilRoot } from "recoil";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <RecoilRoot>
          <PrimeReactProvider>{children}</PrimeReactProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
