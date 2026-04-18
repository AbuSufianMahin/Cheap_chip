import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

async function DeliveryLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!["delivery", "deliveryman"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return children;
}

export default DeliveryLayout;
