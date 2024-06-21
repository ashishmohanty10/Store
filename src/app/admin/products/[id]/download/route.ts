import prisma from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      filepath: true,
      name: true,
    },
  });

  if (product == null) return notFound();

  const { size } = await fs.stat(product.filepath);
  const file = await fs.readFile(product.filepath);

  const extension = product.filepath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename = "${product.name}.${extension}"`,

      "Content-Length": size.toLocaleString(),
    },
  });
}