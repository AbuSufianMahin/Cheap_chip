import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

async function DashboardProtectedLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?message=login_required");
  }

  return children;
}

export default DashboardProtectedLayout;