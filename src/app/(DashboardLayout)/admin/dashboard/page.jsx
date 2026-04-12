import { redirect } from "next/navigation";

function AdminDashboardPage() {
  redirect("/admin/applications");
}

export default AdminDashboardPage;