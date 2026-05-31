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

  // Ordina mantenendo la stabilita': i selezionati vanno in cima, i non selezionati in fondo.
  // L'ordinamento e' stabile: l'ordine relativo all'interno dei due gruppi e' preservato.
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aSelected = a.selected ? 1 : 0;
    const bSelected = b.selected ? 1 : 0;
    return bSelected - aSelected;
  });

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
        sortedProducts.map((item) => {
          // Recupera sempre l'indice originale nell'array products per updateItem e toggleSelect
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
