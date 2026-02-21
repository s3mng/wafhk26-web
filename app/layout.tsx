import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bobyak",
  description: "함께 만들어가는 우리들의 추억",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-sm relative">
          {children}
        </div>
      </body>
    </html>
  );
}
