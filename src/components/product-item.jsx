"use client";

import { Checkbox } from "@/components/ui/checkbox";
import QuantityButton from "@/components/quantity-button";

function fixDecimal(d) {
  return d.toFixed(2).replace(".", ",");
}

export function ProductItem({ item, index, updateItem, toggleSelect }) {
  const handleDoubleClick = () => {
    const event = new CustomEvent("edit-product", { detail: index });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full grid grid-cols-5 gap-3">
      <div className="col-span-3 flex gap-3">
        <Checkbox
          className="w-6 h-6"
          checked={item.selected || false}
          onCheckedChange={() => toggleSelect(index)}
        />
        <span
          className={`cursor-pointer break-all ${item.selected ? "line-through" : ""}`}
          onDoubleClick={handleDoubleClick}
        >
          {item.description}
        </span>
      </div>
      <div className="col-span-2 w-full justify-center items-end flex flex-col gap-1">
        <p>€{fixDecimal(item.price)}</p>
        <QuantityButton
          quantity={item.quantity}
          setQuantity={(q) => updateItem(index, "quantity", q)}
        />
      </div>
    </div>
  );
}
