import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ToasterClient } from "@/components/toaster-client";

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
          {children}
          <ToasterClient />
        </ThemeProvider>
      </body>
    </html>
  );
}
