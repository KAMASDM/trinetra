import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminCommandPalette from "@/components/admin/AdminCommandPalette";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();
  if (!session) redirect("/admin/login");

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      className="bg-ivory"
    >
      <AdminSidebar />
      <SidebarInset className="bg-ivory">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-gold/15 bg-warm-white/95 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex-1" />
          <AdminCommandPalette />
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
