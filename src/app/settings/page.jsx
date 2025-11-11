"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    mealVoucherEnabled: false,
    mealVoucherValue: 0,
  });
  const [loaded, setLoaded] = useState(false);

  // Recupera le impostazioni dal localStorage all'apertura
  useEffect(() => {
    const stored = localStorage.getItem("settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error("Errore parsing settings", e);
      }
    }
    setLoaded(true);
  }, []);

  // Aggiorna localStorage quando cambiano le impostazioni
  useEffect(() => {
    if (loaded) {
      console.log("Salvo settings:", settings);
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings, loaded]);

  const toggleMealVoucher = () => {
    setSettings((prev) => ({
      ...prev,
      mealVoucherEnabled: !prev.mealVoucherEnabled,
    }));
  };

  const handleMealVoucherValueChange = (e) => {
    const value = parseFloat(e.target.value);
    setSettings((prev) => ({
      ...prev,
      mealVoucherValue: isNaN(value) ? 0 : value,
    }));
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header */}
      <div className="p-3 flex justify-between gap-3 border-b">
        <div className="flex items-center gap-3">
          <Link href={"/"}>
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <p className="font-bold text-lg">Impostazioni</p>
        </div>

        <ModeToggle />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-xl p-4 flex flex-col gap-6">
        {/* Buoni pasto */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Buoni pasto</p>
            <p className="text-sm text-gray-500">
              Attiva/disattiva l'uso dei buoni pasto
            </p>
          </div>
          <Switch
            checked={settings.mealVoucherEnabled}
            onCheckedChange={toggleMealVoucher}
          />
        </div>

        {/* Valore buono pasto */}
        {settings.mealVoucherEnabled && (
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="mealVoucherValue">
              Valore buono pasto (€)
            </label>
            <Input
              id="mealVoucherValue"
              type="tel"
              inputMode="decimal"
              value={settings.mealVoucherValue}
              onChange={handleMealVoucherValueChange}
              placeholder="Inserisci il valore"
            />
          </div>
        )}

        {/* Bottone Salva */}
        <Button
          onClick={() => {
            localStorage.setItem("settings", JSON.stringify(settings));
            toast.success("Modifica effettuata con successo");
          }}
        >
          Salva impostazioni
        </Button>
      </div>
    </div>
  );
}
