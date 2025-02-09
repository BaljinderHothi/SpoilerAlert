"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"

export function ItemForm() {
  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")

   const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      try {
        const response = await fetch(`http://localhost:3000/api/fda?product=${itemName}`);
        if (!response.ok) {
          throw new Error('Network response error');
        }
        const data = await response.json();
        console.log('API Response:', data);
      } catch (error) {
        console.error('There was a problem with fetching from FDA API:', error);
      }
    }
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
      </div>
    </div>
  );
}
