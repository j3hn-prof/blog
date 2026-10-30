import type { Metadata } from "next";
import Footer from "./components/footer.tsx";
import Header from "./components/header.tsx";

import "./globals.css";

export const metadata: Metadata = {
  title: "My First Blog",
  description: "j3hn's blog to learn react/next!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Header />
        <main className="bordered-box">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
