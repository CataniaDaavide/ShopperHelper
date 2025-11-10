"use client";
//#region components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EuroIcon, Settings, ShoppingBag, Trash } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import QuantityButton from "@/components/quantity-button";
import { Spinner } from "@/components/ui/spinner";
import {
  ProductsContext,
  ProductsProvider,
} from "@/components/products-context";
import { ModeToggle } from "@/components/mode-toggle";
//#endregion

//#region Navbar
function Navbar() {
  return (
    <div className="p-3 w-full flex items-center justify-between gap-3 border-b">
      <div className="flex gap-3">
        <ShoppingBag />
        <p className="font-bold text-lg">Shopper Helper</p>
      </div>
      <div className="flex gap-3">
        <ModeToggle />
        <Link href={"/settings"}>
          <Button size={"icon"} variant={"outline"}>
            <Settings />
          </Button>
        </Link>
      </div>
    </div>
  );
}
//#endregion

export default function Home() {
  return (
    <ProductsProvider>
      <div className="w-screen h-screen flex flex-col gap-6 items-center">
        <Navbar />
        <ProductContainer />
      </div>
    </ProductsProvider>
  );
}

//#region ProductContainer
function ProductContainer() {
  const { products } = useContext(ProductsContext);

  const [settings, setSettings] = useState({
    mealVoucherEnabled: false,
    mealVoucherValue: 0,
  });

  // Recupera settings dal localStorage
  useEffect(() => {
    const stored = localStorage.getItem("settings");
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  if (!products) return <Spinner />;

  // Calcolo spesa totale
  const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  // Calcolo importo mancante per il multiplo del buono pasto
  let remaining = 0;
  if (
    settings.mealVoucherEnabled &&
    settings.mealVoucherValue > 0 &&
    total > 0
  ) {
    const modulo = total % settings.mealVoucherValue;
    remaining = modulo === 0 ? 0 : settings.mealVoucherValue - modulo;
  }

  return (
    <div className="w-full max-w-xl flex-1 flex flex-col px-3">
      <div className="w-full flex justify-between pb-5">
        <AddProducts />
        <DeleteListBtn />
      </div>

      {/* Totale spesa */}
      <div className="w-full flex gap-3 items-center justify-end mb-3">
        <p className="font-bold text-lg">Totale: €{total.toFixed(2)}</p>
        {settings.mealVoucherEnabled && remaining > 0 && (
          <p className="text-orange-500 font-semibold">
            €{remaining.toFixed(2)}
          </p>
        )}
      </div>

      {products.length === 0 ? <NoProducts /> : <ListProducts />}
    </div>
  );
}

function NoProducts() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <p className="text-gray-500">
        Usa il pulsante "Aggiungi prodotto" per inserire prodotti nella lista
      </p>
    </div>
  );
}
//#endregion

//#region ListProducts
function ListProducts() {
  const { products, setProducts } = useContext(ProductsContext);

  const toggleSelect = (index) => {
    const updated = [...products];
    updated[index].selected = !updated[index].selected;
    setProducts(updated);
  };

  const changeQuantity = (index, newQuantity) => {
    const updated = [...products];
    updated[index].quantity = newQuantity;
    setProducts(updated);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6">
      {products.map((item, index) => (
        <div key={index} className="w-full grid grid-cols-2 gap-3">
          <div className="flex gap-3 items-center col-span-2 md:col-span-1">
            <Checkbox
              className={"w-6 h-6"}
              checked={item.selected || false}
              onCheckedChange={() => toggleSelect(index)}
            />
            <span
              className="cursor-pointer text-wrap"
              onDoubleClick={() => {
                const event = new CustomEvent("edit-product", {
                  detail: index,
                });
                window.dispatchEvent(event);
              }}
            >
              {item.description}
            </span>
          </div>
          <div className="w-full justify-end flex gap-3 col-span-2 md:col-span-1">
            <ButtonGroup>
              <Button variant="outline" className="w-[100px]">
                {item.price}
              </Button>
              <Button variant="outline">
                <EuroIcon />
              </Button>
            </ButtonGroup>
            <QuantityButton
              quantity={item.quantity}
              setQuantity={(q) => changeQuantity(index, q)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
//#endregion

//#region DeleteListBtn
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

//#endregion

//#region AddProducts
function AddProducts() {
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
      setPrice(product.price.toString());
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

  const handleSubmit = () => {
    if (!description || !price) return;

    const newProduct = {
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      selected: false, // inizialmente non selezionato
    };

    if (editingIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editingIndex] = newProduct;
      setProducts(updatedProducts);
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }

    setDescription("");
    setPrice("0");
    setQuantity(1);
    setEditingIndex(null);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>
          {editingIndex !== null ? "Modifica prodotto" : "Aggiungi prodotti"}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>
              {editingIndex !== null
                ? "Modifica prodotto"
                : "Aggiungi prodotto"}
            </DrawerTitle>
            <DrawerDescription>
              Inserisci le informazioni del prodotto
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              <span>Descrizione</span>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Inserisci descrizione"
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span>Prezzo</span>
              <div className="flex gap-6">
                <ButtonGroup>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="tel"
                    inputMode="decimal"
                    placeholder="Inserisci prezzo"
                    onKeyPress={handleKeyPress}
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
            <Button onClick={handleSubmit}>
              {editingIndex !== null ? "Modifica" : "Aggiungi"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
//#endregion
