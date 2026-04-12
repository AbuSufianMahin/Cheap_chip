import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return children;
}

export default AdminLayout;