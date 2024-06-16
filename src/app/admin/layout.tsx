import { Nav, NavLink } from "@/components/Nav";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav>
        {navpath.map((data, idx) => (
          <NavLink key={idx} href={data.path}>
            {data.name}
          </NavLink>
        ))}
      </Nav>

      <div className="container my-6">{children}</div>
    </>
  );
}

const navpath = [
  {
    name: "Dashboard",
    path: "/admin",
  },
  {
    name: "Products",
    path: "/admin/products",
  },
  {
    name: "Customer",
    path: "/admin/users",
  },
  {
    name: "Orders",
    path: "/admin/orders",
  },
];
