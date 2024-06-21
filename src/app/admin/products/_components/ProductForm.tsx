"use client";

import { addProduct, updateProduct } from "@/app/admin/_action/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, actions] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  const [priceInRupees, setPriceInRupees] = useState<number | undefined>(
    product?.priceInRupees
  );
  return (
    <form action={actions} className="space-y-8">
      {/* name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
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
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <div className="text-destuctive">{error.description}</div>
        )}
      </div>

      {/* File */}
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />

        {product != null && (
          <div className="text-muted-foreground">{product?.filepath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product?.imagePath}
            height={400}
            width={400}
            alt="product Image"
          />
        )}
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
