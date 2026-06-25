import Navbar from "@/components/Navbar";
import AdminConsole from "@/components/admin/AdminConsole";

export const metadata = {
  title: "Admin | Trinetra By Rajababu",
};

export default function AdminPage() {
  return (
    <main>
      <Navbar />
      <AdminConsole />
    </main>
  );
}
