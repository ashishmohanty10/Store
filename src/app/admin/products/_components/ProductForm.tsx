"use client";

import { addProduct } from "@/app/admin/_action/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatter";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export function ProductForm() {
  const [error, actions] = useFormState(addProduct, {});

  const [priceInRupees, setPriceInRupees] = useState<number>();
  return (
    <form action={actions} className="space-y-8">
      {/* name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>

      {/* price */}
      <div className="space-y-2">
        <Label htmlFor="priceInRupees">Price In Rupees</Label>
        <Input
          type="text"
          id="priceInRupees"
          name="priceInRupees"
          required
          value={priceInRupees}
          onChange={(e) =>
            setPriceInRupees(Number(e.target.value) || undefined)
          }
        />

        <div className="text-muted-foreground">
          {formatCurrency(priceInRupees || 0 / 100)}
        </div>
        {error.priceInRupees && (
          <div className="text-destuctive">{error.priceInRupees}</div>
        )}
      </div>
      {/* Descriptiom */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input type="text" id="description" name="description" required />
        {error.description && (
          <div className="text-destuctive">{error.description}</div>
        )}
      </div>

      {/* File */}
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
        {error.image && <div className="text-destuctive">{error.image}</div>}
      </div>

      <SubmitFunction />
    </form>
  );
}

function SubmitFunction() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving" : "Save"}
    </Button>
  );
}
