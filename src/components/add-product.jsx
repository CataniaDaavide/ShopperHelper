"use client";

import { useContext, useState, useEffect } from "react";
import { ProductsContext } from "@/components/products-context";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Trash, EuroIcon } from "lucide-react";
import QuantityButton from "@/components/quantity-button";

function fixDecimal(d) {
  return d.toFixed(2).replace(".", ",");
}

export function AddProduct() {
  const { products, setProducts } = useContext(ProductsContext);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [quantity, setQuantity] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const index = e.detail;
      const product = products[index];
      setDescription(product.description);
      setPrice(product.price === 0 ? "0" : fixDecimal(product.price));
      setQuantity(product.quantity);
      setEditingIndex(index);
      setIsOpen(true);
    };
    window.addEventListener("edit-product", handler);
    return () => window.removeEventListener("edit-product", handler);
  }, [products]);

  const handleKeyPress = (e) => {
    const key = e.key;
    const targetId = e.target.id;
    if (targetId === "description" && key === "Enter")
      document.getElementById("price")?.focus();
    else if (targetId === "price" && key === "Enter") handleSubmit();
  };

  const handleFocus = (e) => {
    let value = e.target.value.replace(",", ".");
    if (parseFloat(value) === 0) setPrice("");
  };

  const handleBlur = (e) => {
    let value = e.target.value;
    if (!value) return setPrice("0");
    value = value.replace(".", ",");
    const [integerPart, decimalPart] = value.split(",");
    setPrice(decimalPart === undefined ? integerPart : value);
  };

  const handleChange = (e) => {
    let value = e.target.value.replace(".", ",");
    if (/^[0-9,]*$/.test(value) === false) return;
    const [integerPart, decimalPart] = value.split(",");
    if (decimalPart && decimalPart.length > 2) return;
    setPrice(value);
  };

  const handleDelete = () => {
    if (editingIndex === null) return;
    const updated = products.filter((_, i) => i !== editingIndex);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    resetForm();
  };

  const handleSubmit = () => {
    if (!description || !price) return;

    const newProduct = {
      description,
      price: parseFloat(price.replace(",", ".")),
      quantity: parseInt(quantity),
      selected: false,
    };

    let updatedProducts = editingIndex !== null
      ? products.map((p, i) => (i === editingIndex ? newProduct : p))
      : [...products, newProduct];

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    resetForm();
  };

  const resetForm = () => {
    setDescription("");
    setPrice("0");
    setQuantity(1);
    setEditingIndex(null);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>{editingIndex !== null ? "Modifica prodotto" : "Aggiungi prodotti"}</Button>
      </DrawerTrigger>

      <DrawerContent className="flex items-center justify-center">
        <div className="w-full max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle>{editingIndex !== null ? "Modifica prodotto" : "Aggiungi prodotto"}</DrawerTitle>
            <DrawerDescription>Inserisci le informazioni del prodotto</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              <span>Descrizione</span>
              <div className="flex justify-between gap-3 items-center">
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Inserisci descrizione"
                  onKeyPress={handleKeyPress}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:text-red-500"
                  onClick={handleDelete}
                  disabled={editingIndex === null}
                >
                  <Trash />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span>Prezzo</span>
              <div className="flex justify-between gap-6 items-end">
                <ButtonGroup>
                  <Input
                    id="price"
                    value={price}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                    type="tel"
                    inputMode="decimal"
                    placeholder="Inserisci prezzo"
                    className="max-w-[150px] rounded-r-none"
                  />
                  <Button variant="outline">
                    <EuroIcon />
                  </Button>
                </ButtonGroup>
                <QuantityButton quantity={quantity} setQuantity={setQuantity} />
              </div>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit}>{editingIndex !== null ? "Modifica" : "Aggiungi"}</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Annulla</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
