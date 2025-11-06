import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-3 flex items-center gap-3">
        <Link href={"/"}>
          <ChevronLeft />
        </Link>
        <p className="font-bold">settings page</p>
      </div>
    </div>
  );
}
