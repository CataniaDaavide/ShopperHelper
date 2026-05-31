"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { X, Search } from "lucide-react";
import { AddProduct } from "@/components/add-product";
import { DeleteListBtn } from "@/components//delete-list-btn";
import ProductSuggestions from "@/components/product-suggestions";

function fixDecimal(d) {
  return d.toFixed(2).replace(".", ",");
}

export function ProductsActions({ settings, remaining, total, search, setSearch, allSelected, someSelected, onToggleAll }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCheckboxClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onToggleAll();
    setConfirmOpen(false);
  };

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
        <AddProduct initialDescription={search} />
        <div className="flex items-center gap-3">
          {settings?.mealVoucherEnabled && (
            <ProductSuggestions remaining={remaining} />
          )}
          <DeleteListBtn />
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-3">
        {/* Checkbox per selezionare/deselezionare tutti i prodotti con conferma */}
        <div className="flex items-center gap-2">
          <Checkbox
            className="w-6 h-6"
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={handleCheckboxClick}
          />
          <span className="text-sm text-zinc-500">Seleziona tutti</span>
        </div>

        <div className="flex items-center gap-3">
          <p className="font-bold text-lg">Totale: €{fixDecimal(total)}</p>
          {settings?.mealVoucherEnabled && remaining > 0 && (
            <p className="text-orange-500 font-semibold">€{fixDecimal(remaining)}</p>
          )}
        </div>
      </div>

      {/* Dialog di conferma per selezione/deselezione di tutti i prodotti */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {allSelected ? "Deselezionare tutti?" : "Selezionare tutti?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {allSelected
                ? "Vuoi deselezionare tutti i prodotti?"
                : "Vuoi selezionare tutti i prodotti?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirm}>Conferma</AlertDialogAction>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
