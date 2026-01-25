"use client";

import { useContext, useState } from "react";
import { ProductsContext } from "@/components/products-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function DeleteListBtn() {
  const { products, setProducts } = useContext(ProductsContext);
  const [open, setOpen] = useState(false);

  const hasSelected = products.some((p) => p.selected);

  const handleDeleteSelected = () =>
    setProducts(products.filter((p) => !p.selected));
  const handleDeleteAll = () => setProducts([]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer hover:text-red-500"
          disabled={products?.length === 0}
          onClick={() => setOpen(true)}
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminare prodotti?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasSelected
              ? "Hai selezionato alcuni prodotti. Vuoi eliminare solo quelli selezionati o tutti?"
              : "Vuoi eliminare tutti i prodotti?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          {hasSelected && (
            <AlertDialogAction onClick={handleDeleteSelected}>
              Solo selezionati
            </AlertDialogAction>
          )}
          <AlertDialogAction onClick={handleDeleteAll}>Tutti</AlertDialogAction>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
