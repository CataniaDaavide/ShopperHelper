import { ProductsProvider } from "@/components/products-context";
import "./globals.css";

export const metadata = {
  title: "ShopperHelper",
  description:
    "Applicazione per facilitare il conteggio dei buoni pasto durante la spesa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
