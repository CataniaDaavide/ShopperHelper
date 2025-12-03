"use client";

//#region components
import { settingsData } from "./settings/page.jsx";
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
import ProductSuggestions from "@/components/product-suggestions";
//#endregion

function fixDecimal(d) {
  return d.toFixed(2).replace(".", ",");
}

function stringToFloat(str) {
  return parseFloat(str.replace(",", "."));
}

function floatToString(num) {
  return num.toFixed(2).replace(".", ",");
}

export default function HomePage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Header />
      <ProductContainer />
    </div>
  );
}

//#region Header
function Header() {
  return (
    <div className="p-3 w-full flex items-center justify-between gap-3 border-b">
      {/* logo */}
      <div className="flex gap-3">
        <ShoppingBag />
        <p className="font-bold text-lg">Shopper Helper</p>
      </div>

      {/* action */}
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

//#region ProductContainer
function ProductContainer() {
  const { products } = useContext(ProductsContext);

  const defaultSettings = settingsData.reduce(
    (acc, item) => ({ ...acc, ...item.default }),
    {}
  );
  const [settings, setSettings] = useState(defaultSettings);

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
    <div className="w-full h-full overflow-y-auto flex flex-col px-3 gap-6">
      <ProductsActions
        settings={settings}
        remaining={remaining}
        total={total}
      />
      <ProductListItems products={products} />
      {/* {products.length === 0 ? <NoProducts /> : <ListProducts />} */}
    </div>
  );
}

function ProductsActions({ settings, remaining, total }) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* action */}
      <div className="w-full flex items-center justify-between">
        <AddProducts />
        <div className="flex items-center gap-3">
          {settings?.mealVoucherEnabled && (
            <ProductSuggestions remaining={remaining} />
          )}
          <DeleteListBtn />
        </div>
      </div>

      {/* total */}
      <div className="w-full flex items-center justify-end gap-3">
        <p className="font-bold text-lg">Totale: €{fixDecimal(total)}</p>
        {settings?.mealVoucherEnabled && remaining > 0 && (
          <p className="text-orange-500 font-semibold">
            €{fixDecimal(remaining)}
          </p>
        )}
      </div>
    </div>
  );
}

function ProductListItems() {
  const { products, setProducts } = useContext(ProductsContext);

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
    <div className="w-full flex-1 overflow-y-auto flex flex-col px-3 gap-6">
      {products.length === 0 ? (
        <NoProducts />
      ) : (
        products.map((item, index) => {
          return (
            <ProductItem
              key={index}
              item={item}
              index={index}
              updateItem={updateItem}
              toggleSelect={toggleSelect}
            />
          );
        })
      )}

      {/* questo div evita chè l'ultimo item sia attaccato al bordo del dispositivo */}
      {products.length != 0 && <div className="w-full min-h-20"></div>}
    </div>
  );
}

function ProductItem({ item, index, updateItem, toggleSelect }) {
  return (
    <div className="w-full grid grid-cols-3 gap-3">
      <div className="col-span-2 flex gap-3 items-center">
        <Checkbox
          className={"w-6 h-6"}
          checked={item.selected || false}
          onCheckedChange={() => toggleSelect(index)}
        />
        <span
          className={`cursor-pointer break-all ${
            item.selected && "line-through"
          }`}
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
      <div className="w-full flex-col justify-end flex items-center gap-1">
        <p>€{fixDecimal(item.price)}</p>
        <QuantityButton
          quantity={item.quantity}
          setQuantity={(q) => updateItem(index, "quantity", q)}
        />
      </div>
    </div>
  );
}

function NoProducts() {
  return (
    <div className="w-full text-center">
      <p className="text-gray-500">
        Usa il pulsante "Aggiungi prodotto" per inserire prodotti nella lista
      </p>
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
          <AlertDialogCancel>Annulla</AlertDialogCancel>
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
    try {
      var value = e.target.value;
      value = value.replace(",", ".");
      if (parseFloat(value) === 0) {
        setPrice("");
      }
    } catch (error) {}
  };

  const handleBlur = (e) => {
    try {
      var value = e.target.value;
      if (value === "") {
        setPrice(0);
        return;
      }

      value = value.replace(".", ",");

      const [integerPart, decimalPart] = value.split(",");
      //se dopo la virgola non vengono inseriti numeri, prende solo la parte intera
      if (decimalPart.length === 0) {
        setPrice(integerPart);
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    try {
      var value = e.target.value;

      if (value === "") {
        setPrice(value);
        return;
      }

      value = value.replace(".", ",");

      //se si inseriscono valori non permessi esce
      if (/^[0-9.,]+$/.test(value) === false) return;

      const [integerPart, decimalPart] = value.split(",");
      //se i decimali sono più di due esce
      if (decimalPart && decimalPart.length > 2) return;

      setPrice(value);
    } catch (error) {}
  };

  const handleSubmit = () => {
    if (!description || !price) return;

    const newProduct = {
      description,
      price: parseFloat(price.replace(",", ".")),
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
              <div className="flex justify-between gap-6">
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
                    className={"max-w-[150px]"}
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
                Annulla
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
//#endregion
