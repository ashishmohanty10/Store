import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminProductPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Product</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Products</Link>
        </Button>
      </div>

      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const product = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      priceInRupees: true,
      isAvailableForPurchase: true,
      _count: {
        select: {
          order: true,
        },
      },
    },

    orderBy: { name: "asc" },
  });

  if (product.length === 0) return <p>No products found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available for purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {product.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <CheckCircle2 />
                  <span className="sr-only">Availble</span>
                </>
              ) : (
                <>
                  <XCircle />
                  <span className="sr-only">Unavailble</span>
                </>
              )}
            </TableCell>

            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInRupees / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.order / 100)}</TableCell>

            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/download`} download>
                      Download
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
