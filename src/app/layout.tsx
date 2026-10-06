import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Clarence Legaspi | Frontend Developer",
  description:
    "Portfolio of John Clarence A. Legaspi, a frontend developer and Information Technology graduate based in Bulacan, Philippines.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
