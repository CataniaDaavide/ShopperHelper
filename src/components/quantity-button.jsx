"use client"
import { Minus, Plus } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

export default function QuantityButton({ quantity, setQuantity }) {
  const [disableMinus, setDisableMinus] = useState(quantity <= 0);
  const quantityRef = useRef();

  // Aggiorna il ref quando cambia la quantity esterna
  useEffect(() => {
    quantityRef.current.value = quantity;
    setDisableMinus(quantity <= 0);
  }, [quantity]);

  // Aggiunge 1 alla quantità
  const add = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    quantityRef.current.value = newQuantity;
    setDisableMinus(newQuantity <= 0);
  };

  // Sottrae 1 alla quantità
  const minus = () => {
    if (quantity <= 0) return;
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    quantityRef.current.value = newQuantity;
    setDisableMinus(newQuantity <= 0);
  };

  // Gestione input manuale
  const handleChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    if (value < 0) value = 0;
    setQuantity(value);
    setDisableMinus(value <= 0);
  };

  return (
    <ButtonGroup>
      <Button disabled={disableMinus} variant="outline" onClick={minus}>
        <Minus />
      </Button>
      <Input
        variant="outline"
        className="w-full max-w-[50px]"
        ref={quantityRef}
        onChange={handleChange}
        value={quantity}
      />
      <Button variant="outline" onClick={add}>
        <Plus />
      </Button>
    </ButtonGroup>
  );
}
