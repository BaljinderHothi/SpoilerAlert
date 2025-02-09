"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"

export function ItemForm() {
  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")

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
          />
          <p className="text-sm text-muted-foreground">
            The name of your item.
          </p>
        </div>
      </div>
    </div>
  );
} 