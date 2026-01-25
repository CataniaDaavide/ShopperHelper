"use client";

import { ShoppingBag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function Header() {
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
