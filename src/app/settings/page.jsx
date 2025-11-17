"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";

const settingsData = [
  {
    name: "mealVoucher",
    title: "Buoni pasto",
    description: "Attiva/disattiva l'uso dei buoni pasto",
    inputInfo: {
      id: "mealVoucherValue",
      field: "Valore buono pasto (€)",
      type: "tel",
      placeholder: "Inserisci il valore",
    },
    default: {
      mealVoucherEnabled: false,
      mealVoucherValue: 0,
    },
  },
];

export default function SettingsPage() {
  const defaultSettings = settingsData.reduce(
    (acc, item) => ({ ...acc, ...item.default }),
    {}
  );

  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  // Recupera dal localStorage
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

  // Salva nel localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings, loaded]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <HeaderSettings />

      <div className="mx-auto w-full h-full max-w-xl p-4 flex flex-col justify-between gap-6">
        <Settings settings={settings} setSettings={setSettings} />
        <SettingsSaveBtn settings={settings} />
      </div>
    </div>
  );
}

function HeaderSettings() {
  return (
    <div className="p-3 flex justify-between gap-3 border-b">
      <div className="flex items-center gap-3">
        <Link href={"/"}>
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <p className="font-bold text-lg">Impostazioni</p>
      </div>

      <ModeToggle />
    </div>
  );
}

function Settings({ settings, setSettings }) {
  return (
    <div className="w-full flex-1 flex-col overflow-y-auto gap-3 flex">
      {settingsData.map((item, index) => (
        <SettingItem
          key={index}
          data={item}
          settings={settings}
          setSettings={setSettings}
        />
      ))}
    </div>
  );
}

function SettingItem({ data, settings, setSettings }) {
  const { name, title, description, inputInfo } = data;
  const { id, field, type, placeholder } = inputInfo;

  const enabledKey = `${name}Enabled`;
  const valueKey = `${name}Value`;

  const toggleChecked = () => {
    setSettings((prev) => ({
      ...prev,
      [enabledKey]: !prev[enabledKey],
    }));
  };

  const handleValueChange = (e) => {
    const num = parseFloat(e.target.value);
    setSettings((prev) => ({
      ...prev,
      [valueKey]: isNaN(num) ? 0 : num,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <Switch checked={settings[enabledKey]} onCheckedChange={toggleChecked} />
      </div>

      {settings[enabledKey] && (
        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor={id}>
            {field}
          </label>
          <Input
            id={id}
            type={type}
            inputMode="decimal"
            value={settings[valueKey]}
            onChange={handleValueChange}
            placeholder={placeholder}
          />
        </div>
      )}
    </div>
  );
}

function SettingsSaveBtn({ settings }) {
  return (
    <Button
      onClick={() => {
        localStorage.setItem("settings", JSON.stringify(settings));
        toast.success("Modifica effettuata con successo");
      }}
    >
      Salva impostazioni
    </Button>
  );
}
