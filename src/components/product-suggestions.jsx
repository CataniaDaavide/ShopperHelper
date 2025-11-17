"use client";

//#region components
import React, { useContext, useEffect, useState } from "react";
import { ProductsContext } from "./products-context";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Dot, Lightbulb } from "lucide-react";
//#endregion

export default function ProductSuggestions({ remaining }) {
  const { products } = useContext(ProductsContext);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (products?.length) {
      setSuggestions(getSuggestedProducts(products, remaining));
    }
  }, [products, remaining]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          variant="outline"
        >
          <Lightbulb className="text-white" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex items-center justify-center">
        <div className="w-full max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle>Suggerimento</DrawerTitle>
            <DrawerDescription>
              Suggerimento per completare la tua spesa usando i buoni pasto
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 p-4">
            <p>
              Mancano <strong>€{remaining.toFixed(2)}</strong> per il prossimo
              buono pasto.
            </p>

            {suggestions.length > 0 ? (
              <>
                <p>Puoi aggiungere i seguenti prodotti:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {suggestions.map((p, i) => (
                    <li key={i} className="flex justify-between">
                      <div className="flex">
                        <Dot />
                        <span>{p.description}</span>
                      </div>
                      <span className="font-medium">€{p.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Nessun prodotto suggerito per questa cifra.
              </p>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Chiudi
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// 🧮 Funzione per calcolare i suggerimenti
function getSuggestedProducts(products, remaining) {
  if (remaining <= 0 || !products.length) return [];

  let closest = { diff: Infinity, combo: [] };
  const limit = Math.min(products.length, 15);

  // Singoli
  for (let i = 0; i < limit; i++) {
    const p = products[i];
    const diff = Math.abs(remaining - p.price);
    if (diff < closest.diff) closest = { diff, combo: [p] };
  }

  // Coppie
  for (let i = 0; i < limit; i++) {
    for (let j = i + 1; j < limit; j++) {
      const sum = products[i].price + products[j].price;
      const diff = Math.abs(remaining - sum);
      if (diff < closest.diff)
        closest = { diff, combo: [products[i], products[j]] };
    }
  }

  // Triplette (opzionali)
  for (let i = 0; i < limit; i++) {
    for (let j = i + 1; j < limit; j++) {
      for (let k = j + 1; k < limit; k++) {
        const sum = products[i].price + products[j].price + products[k].price;
        const diff = Math.abs(remaining - sum);
        if (diff < closest.diff)
          closest = { diff, combo: [products[i], products[j], products[k]] };
      }
    }
  }

  // Restituisce solo se la differenza è accettabile
  return closest.diff <= 0.5 ? closest.combo : [];
}
