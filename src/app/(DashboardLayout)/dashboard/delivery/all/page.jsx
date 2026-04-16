"use client";

import DeliveryAssignmentsBoard from "@/components/DashboardLayout/deliveryRoutesUI/DeliveryAssignmentsBoard";

function AllDeliveriesPage() {
  return (
    <DeliveryAssignmentsBoard
      title="All Deliveries"
      description="All products ever assigned to you."
      activeOnly={false}
      allowStatusUpdate={false}
    />
  );
}

export default AllDeliveriesPage;
