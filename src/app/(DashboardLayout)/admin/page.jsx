import { redirect } from "next/navigation";

function AdminPage() {
  redirect("/admin/applications");
}

export default AdminPage;