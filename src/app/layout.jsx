import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ToasterClient } from "@/components/toaster-client";
import { ProductsProvider } from "@/components/products-context";

export const metadata = {
  title: "ShopperHelper",
  description:
    "Applicazione per facilitare il conteggio dei buoni pasto durante la spesa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
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
