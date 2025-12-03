"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

export default function QuantityButton({ quantity, setQuantity }) {
  const [disableMinus, setDisableMinus] = useState(quantity <= 0);

  // Aggiorna il ref quando cambia la quantity esterna
  useEffect(() => {
    setDisableMinus(quantity <= 0);
  }, [quantity]);

  // Aggiunge 1 alla quantità
  const add = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setDisableMinus(newQuantity <= 0);
  };

  // Sottrae 1 alla quantità
  const minus = () => {
    if (quantity <= 0) return;
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    setDisableMinus(newQuantity <= 0);
  };

  return (
    <div className="flex">
      <Button disabled={disableMinus} variant="outline" onClick={minus}>
        <Minus />
      </Button>
      <Button variant={"outline"} size={"icon"} className={"border-none hover:bg-transparent"}>
        {quantity}
      </Button>
      <Button variant="outline" onClick={add}>
        <Plus />
      </Button>
    </div>
  );
}
