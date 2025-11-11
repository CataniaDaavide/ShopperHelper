"use client"
import React, { createContext, useState, useEffect } from "react";

export const ProductsContext = createContext({
  products: [],
  setProducts: () => {},
});


const exampleProducts = [
  {
    description: "Pane integrale",
    price: 2.5,
    quantity: 1,
    selected: false,
  },
  {
    description: "Latte parzialmente scremato",
    price: 1.6,
    quantity: 2,
    selected: false,
  },
  {
    description: "Uova biologiche (6pz)",
    price: 3.2,
    quantity: 1,
    selected: false,
  },
  {
    description: "Pasta di semola 500g",
    price: 1.1,
    quantity: 3,
    selected: false,
  },
  {
    description: "Tonno in scatola",
    price: 2.9,
    quantity: 2,
    selected: false,
  },
  {
    description: "Pomodori ciliegini",
    price: 2.4,
    quantity: 1,
    selected: false,
  },
  {
    description: "Acqua naturale 1.5L",
    price: 0.6,
    quantity: 6,
    selected: false,
  },
  {
    description: "Mela Golden",
    price: 0.9,
    quantity: 4,
    selected: false,
  },
  {
    description: "Petto di pollo 500g",
    price: 6.5,
    quantity: 1,
    selected: false,
  },
  {
    description: "Zucchine",
    price: 1.8,
    quantity: 2,
    selected: false,
  },
];


export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(exampleProducts);

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setProducts(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};