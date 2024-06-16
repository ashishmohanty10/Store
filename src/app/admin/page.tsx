import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";

//getting the sales data from backend ⤵️
async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { priceInRupees: true },
    _count: true,
  });

  return {
    amount: (data._sum.priceInRupees || 0) / 100,
    numberOfSales: data._count,
  };
}

//getting the user data from backend ⤵️
async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { priceInRupees: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.priceInRupees || 0) / userCount / 100,
  };
}

//getting the product data from backend ⤵️
async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({
      where: { isAvailableForPurchase: true },
    }),
    prisma.product.count({
      where: { isAvailableForPurchase: false },
    }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

// admin daskboard ⤵️
export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        description={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />

      <DashboardCard
        title="Customers"
        description={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        description={`${formatNumber(productData.inactiveCount)} Inactive `}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

type DashBoardCardProps = {
  title: string;
  description: string;
  body: string;
};

//dashboard card componenet
function DashboardCard({ title, description, body }: DashBoardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
