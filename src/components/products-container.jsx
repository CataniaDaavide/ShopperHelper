"use client";

import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "@/components/products-context";
import { Spinner } from "@/components/ui/spinner";
import { ProductsActions } from "./products-actions";
import { ProductItemsList } from "./product-item-list";
import { settingsData } from "@/app/settings/page.jsx";

function fixDecimal(d) {
  return d.toFixed(2).replace(".", ",");
}

export function ProductsContainer() {
  const { products } = useContext(ProductsContext);

  const defaultSettings = settingsData.reduce(
    (acc, item) => ({ ...acc, ...item.default }),
    {}
  );
  const [settings, setSettings] = useState(defaultSettings);
  const [search, setSearch] = useState("");

  // Recupera settings dal localStorage
  useEffect(() => {
    const stored = localStorage.getItem("settings");
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  if (!products) return <Spinner />;

  const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  let remaining = 0;
  if (settings.mealVoucherEnabled && settings.mealVoucherValue > 0 && total > 0) {
    const modulo = total % settings.mealVoucherValue;
    remaining = modulo === 0 ? 0 : settings.mealVoucherValue - modulo;
  }

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col gap-6 p-4">
      <ProductsActions
        settings={settings}
        remaining={remaining}
        total={total}
        search={search}
        setSearch={setSearch}
      />
      <ProductItemsList search={search} />
    </div>
  );
}
