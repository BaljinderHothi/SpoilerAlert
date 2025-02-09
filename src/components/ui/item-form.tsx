"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ItemFormProps {
  onItemNameSubmit: (itemName: string) => void;
}

export function ItemForm({ onItemNameSubmit }: ItemFormProps) {
  const [itemName, setItemName] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onItemNameSubmit(itemName);
    }
  };

  function handleSubmit() {
    onItemNameSubmit(itemName);
  }

  return (
    <div className="h-full flex items-center">
      <div className="space-y-6 max-w-md w-full mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Item Name
          </label>
          <Input
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <p className="text-sm text-muted-foreground">
            The name of your item.
          </p>
        </div>
        <button className="bg-black absolute text-white p-2 rounded-lg" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}