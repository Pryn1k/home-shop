import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

// выставляем тему до первой отрисовки, чтобы не было «вспышки» неправильной темы
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.add('light');
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Магазин Домашний",
  description: "Техника для дома: телефоны, телевизоры и не только.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col pt-16">
        <CartProvider>
          <SiteHeader />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
