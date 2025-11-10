import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "ShopperHelper",
  description:
    "Applicazione per facilitare il conteggio dei buoni pasto durante la spesa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased`}>
        {children}
        <Toaster theme="dark"/>
      </body>
    </html>
  );
}
