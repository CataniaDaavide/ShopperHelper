"use client";
//#region components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Euro, EuroIcon, Minus, Plus, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
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
import { Description } from "@radix-ui/react-dialog";
import QuantityButton from "@/components/quantity-button";
//#endregion

export default function Home() {
  const [products, setProducts] = useState([
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
    {
      description: "aaaaaa",
      price: 20.5,
      quantity: 2,
      flag: true,
    },
  ]);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Navbar />
      <div className="w-full h-full max-w-xl p-3">
        <ProductContainer products={products} setProducts={setProducts} />
        {/* <ProductInput setProducts={setProducts} /> */}
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="w-full flex items-center justify-between gap-3 p-3">
      <p className="font-bold">ShopperHelper</p>
      <Link href={"/settings"}>
        <Button size={"icon"} variant={"outline"}>
          <Settings />
        </Button>
      </Link>
    </div>
  );
}

function ProductContainer({ products, setProducts }) {
  return (
    <div className="w-full h-full flex flex-col items-center">
      {products.length == 0 ? (
        <div className="w-full flex flex-col items-center gap-3">
          <p>
            Usa il pulsante "Aggiungi prodotto" per inserre nella lista i
            prodotti
          </p>
          <AddProducts />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex items-center justify-between pb-5">
            <p className="text-lg font-bold">Prodotti</p>
            <div className="flex gap-6">
              <AddProducts />
              <DeleteListBtn />
            </div>
          </div>
          <div className="flex flex-col gap-6">
              {products &&
                products.map((item, index) => {
                  const [quantity, setQuantity] = useState(item.quantity);

                  return (
                    <div key={index} className="w-full flex justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Checkbox />
                        <span>{item.description}</span>
                      </div>
                      <div className="flex gap-3">
                        <ButtonGroup>
                          <Button variant={"outline"}>{item.price}</Button>
                          <Button variant={"outline"}>
                            <EuroIcon />
                          </Button>
                        </ButtonGroup>
                        <QuantityButton quantity={quantity} setQuantity={setQuantity} />
                      </div>
                    </div>
                  );
                })}
            </div>
        </div>
      )}
    </div>
  );
}

function DeleteListBtn() {
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className={"cursor-pointer hover:text-red-500"}
    >
      <Trash />
    </Button>
  );
}

function AddProducts({ product, setProducts }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>Aggiungi prodotti</Button>
      </DrawerTrigger>

      <DrawerContent className={"flex items-center justify-center"}>
        <div className="w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Aggiungi prodotto</DrawerTitle>
            <DrawerDescription>
              Inserisci le informazioni del prodotto
            </DrawerDescription>
          </DrawerHeader>

          <InputContainer />

          <DrawerFooter>
            <Button onClick={() => setIsOpen(false)}>Aggiungi</Button>
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

function InputContainer({ products, setProducts }) {
  const desciptionRef = useRef();
  const priceRef = useRef();
  const [quantity, setQuantity] = useState(1);

  // evento al render del componente
  useEffect(() => {
    priceRef.current.value = "0";
    setQuantity(1);
  }, []);

  const handleKeyPress = (e) => {
    try {
      if (e.key != "Enter") return;

      if (e.target.id == "product") {
        priceRef.current.focus();
      } else if (e.target.id == "price") {
        handleSubmit();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // click sul pulsante inserisci
  const handleSubmit = (e) => {
    try {
      // recupera i valori dei campi
      const desciption = desciptionRef.current.value;
      const price = priceRef.current.value;

      // se i campi sono vuoti esce
      if (desciption == "" || price == "") return;

      // se quantity è vuoto imposta con valore 1
      if (quantity == "") {
        setQuantity(1);
      }

      // creazione prodotto
      const newProducts = {
        desciption: name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      };

      //reset campi di input
      desciptionRef.current.value = "";
      priceRef.current.value = "0";
      setQuantity(1);
      setProducts((prev) => [...prev, newProducts]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-1">
        <span>Descrizione</span>
        <Input
          ref={desciptionRef}
          placeholder="Inserisci descrizione"
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span>Prezzo</span>
        <div className="flex gap-6">
          <ButtonGroup>
            <Input
              ref={priceRef}
              placeholder="Inserisci prezzo"
              type={"tel"}
              onKeyPress={handleKeyPress}
            />
            <Button variant={"outline"}>
              <EuroIcon />
            </Button>
          </ButtonGroup>
          <QuantityButton quantity={quantity} setQuantity={setQuantity} />
        </div>
      </div>
    </div>
  );
}
