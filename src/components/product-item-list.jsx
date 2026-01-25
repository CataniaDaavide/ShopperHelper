"use client";

import { useContext } from "react";
import { ProductsContext } from "@/components/products-context";
import { ProductItem } from "@/components/product-item";
import { NoProducts } from "@/components/no-products";

export function ProductItemsList({ search }) {
  const { products, setProducts } = useContext(ProductsContext);

  const filteredProducts =
    search.length < 2
      ? products
      : products.filter((p) =>
          p.description.toLowerCase().includes(search.toLowerCase())
        );

  const toggleSelect = (index) => {
    const updated = [...products];
    updated[index].selected = !updated[index].selected;
    setProducts(updated);
  };

  const updateItem = (index, property, value) => {
    const updated = [...products];
    updated[index][property] = value;
    setProducts(updated);
  };

  return (
    <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3">
      {products.length === 0 ? (
        <NoProducts />
      ) : (
        filteredProducts.map((item) => {
          const index = products.findIndex((p) => p === item);
          return (
            <div className="w-full flex flex-col gap-3" key={index}>
              <ProductItem
                item={item}
                index={index}
                updateItem={updateItem}
                toggleSelect={toggleSelect}
              />
              <div className="w-full h-px border-b"></div>
            </div>
          );
        })
      )}

      {products.length !== 0 && <div className="w-full min-h-20"></div>}
    </div>
  );
}
