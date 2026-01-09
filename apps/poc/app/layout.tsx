import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "카카오 로그인 - Next.js 15",
  description: "Next.js 15와 카카오 OAuth를 이용한 간편 로그인",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
