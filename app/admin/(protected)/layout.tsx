import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { logoutAction } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-gold/20 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow-stitch mb-1 text-gold/70">Trinetra</p>
            <p className="font-cinzel text-xl text-warm-white">Commerce Desk</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-xs uppercase tracking-[0.25em] text-warm-white/70 hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/shop" className="btn-outline-gold !border-gold/40 !text-gold !py-2 !px-4 text-xs">
              View Storefront
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="px-4 py-2 text-xs uppercase tracking-[0.25em] text-warm-white/50 hover:text-crimson transition-colors">
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
