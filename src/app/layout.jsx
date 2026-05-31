import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ToasterClient } from "@/components/toaster-client";
import { ProductsProvider } from "@/components/products-context";

// Serve per non fare zoommare la pagina da mobile (qundo si fa il doppio click)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "ShopperHelper",
  description:
    "WebApp che ha il compito di semplificare la creazione di liste della spesa e gestire i totali calcolando i buoni pasto",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full" suppressHydrationWarning>
      <body
        className={`w-full h-full antialiased overscroll-none overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProductsProvider>{children}</ProductsProvider>
          <ToasterClient />
        </ThemeProvider>
      </body>
    </html>
  );
}
