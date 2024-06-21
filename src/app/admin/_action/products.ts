"use server";
import prisma from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";

const fileSchema = z.instanceof(File, {
  message: "Required",
});

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInRupees: z.coerce.number().int().min(1),

  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  //create a folder to store  files
  await fs.mkdir("product", { recursive: true });
  //create the filepath for the  file to be saved
  const filepath = `product/${crypto.randomUUID()}-${data.file.name}`;
  //saves the file to the filepath
  await fs.writeFile(filepath, Buffer.from(await data.file.arrayBuffer()));

  //create a folder to store images
  await fs.mkdir("public/product", { recursive: true });
  //create the filepath for the images  to be saved
  const imagePath = `/product/${crypto.randomUUID()}-${data.image.name}`;
  //saves the images to the filepath
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await prisma.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInRupees: data.priceInRupees,
      filepath,
      imagePath,
    },
  });

  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (product == null) return notFound();

  let filepath = product.filepath;

  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filepath);
    //create the filepath for the  file to be saved
    filepath = `product/${crypto.randomUUID()}-${data.file.name}`;
    //saves the file to the filepath
    await fs.writeFile(filepath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;

  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public/${product.imagePath}`);
    const imagePath = `/product/${crypto.randomUUID()}-${data.image.name}`;
    //saves the images to the filepath
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInRupees: data.priceInRupees,
      filepath,
      imagePath,
    },
  });

  redirect("/admin/products");
}
export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await prisma.product.update({
    where: { id },
    data: {
      isAvailableForPurchase,
    },
  });
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({
    where: { id },
  });

  if (product == null) return notFound();
  await fs.unlink(product.filepath);
  await fs.unlink(`public${product.imagePath}`);
}
