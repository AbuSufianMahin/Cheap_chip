import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

async function TechnicianLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "technician") {
    redirect("/dashboard");
  }

  return children;
}

export default TechnicianLayout;
