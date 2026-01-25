"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { AddProduct } from "@/components/add-product";
import { DeleteListBtn } from "@/components//delete-list-btn";
import ProductSuggestions from "@/components/product-suggestions";

function fixDecimal(d) {
  return d.toFixed(2).replace(".", ",");
}

export function ProductsActions({ settings, remaining, total, search, setSearch }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <Input
        placeholder="Cerca prodotto..."
        value={search}
        iconLeft={<Search />}
        actionRight={
          search?.length !== 0 && (
            <Button
              variant="ghost"
              className="absolute right-1 flex items-center text-zinc-400 hover:text-primary hover:bg-transparent!"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </Button>
          )
        }
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="w-full flex items-center justify-between">
        <AddProduct />
        <div className="flex items-center gap-3">
          {settings?.mealVoucherEnabled && (
            <ProductSuggestions remaining={remaining} />
          )}
          <DeleteListBtn />
        </div>
      </div>

      <div className="w-full flex items-center justify-end gap-3">
        <p className="font-bold text-lg">Totale: €{fixDecimal(total)}</p>
        {settings?.mealVoucherEnabled && remaining > 0 && (
          <p className="text-orange-500 font-semibold">€{fixDecimal(remaining)}</p>
        )}
      </div>
    </div>
  );
}
