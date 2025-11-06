"use client";
//#region components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Euro, Plus, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
//#endregion

export default function Home() {
  const [products, setProducts] = useState([]);

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
      {products.length != 0 ? (
        <div className="w-full flex flex-col items-center gap-3">
          <p>
            Usa il pulsante "Aggiungi prodotto" per inserre nella lista i
            prodotti
          </p>
          <Button className={"cursor-pointer"}>
            <Plus /> Aggiungi prodotto
          </Button>
        </div>
      ) : (
        <div className="w-full flex justify-between">
          <p>Prodotti</p>
          <DeleteListBtn />
        </div>
      )}

      <Checkbox id="terms-2" defaultChecked />
      <Input />

      <ButtonGroup>
        <Input />
        <Button variant={"outline"}>
          <Euro />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">
          <Plus />
        </Button>
        <Button variant="outline">{"1"}</Button>
        <Button variant="outline">
          <Plus />
        </Button>
      </ButtonGroup>
      {/* {products.map((p, i) => {
        return <ProductCard data={p} index={i} key={i} />;
      })} */}
    </div>
  );
}

function DeleteListBtn({ products, setProducts }) {
  const handleBtn = (e) => {
    try {
      alert("da completare");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button onClick={handleBtn} size={"icon"} variant={"outline"}>
      <Trash />
    </Button>
  );
}

function ProductCard({ data, index }) {
  const { name, price, quantity } = data;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>PRICE:{price}</p>
        <p>
          QUANTITY;
          {quantity}
        </p>
        <p>
          INDEX:
          {index}
        </p>
      </CardContent>
    </Card>
  );
}

function ProductInput({ setProducts }) {
  const nameRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();

  // evento al render del componente
  useEffect(() => {
    priceRef.current.value = "0";
    quantityRef.current.value = "1";
  }, []);

  const handleKeyPress = (e) => {
    try {
      if (e.key != "Enter") return;

      if (e.target.id == "product") {
        priceRef.current.focus();
      } else if (e.target.id == "price") {
        quantityRef.current.focus();
      } else if (e.target.id == "quantity") {
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
      const name = nameRef.current.value;
      const price = priceRef.current.value;
      var quantity = quantityRef.current.value;

      // se i campi sono vuoti esce
      if (name == "" || price == "") return;

      // se quantity è vuoto imposta con valore 1
      if (quantity == "") {
        quantity = 1;
      }

      // creazione prodotto
      const newProducts = {
        name: name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      };

      //reset campi di input
      nameRef.current.value = "";
      priceRef.current.value = "0";
      quantity.current.value = "1";
      setProducts((prev) => [...prev, newProducts]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span>Nome prodotto</span>
        <Input id="product" ref={nameRef} onKeyPress={handleKeyPress} />
      </div>
      <div className="flex flex-col gap-1">
        <span>Prezzo</span>
        <Input
          id="price"
          type="tel"
          ref={priceRef}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span>Quantità</span>
        <Input
          id="quantity"
          type="tel"
          ref={quantityRef}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Button className={"cursor-pointer"} onClick={handleSubmit}>
        Inserisci
      </Button>
    </div>
  );
}
