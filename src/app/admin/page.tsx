import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db/db";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="Sales" description="Description" body="Body" />
    </div>
  );
}

type DashBoardCardProps = {
  title: string;
  description: string;
  body: string;
};

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

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { priceInRupees: true },
    _count: true,
  });

  return {
    amount: (data._sum.priceInRupees || 0) / 100,
  };
}
