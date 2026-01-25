"use client";

import { Header } from "@/components/header";
import { ProductsContainer } from "@/components/products-container";

export default function HomePage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <ProductsContainer />
    </div>
  );
}
