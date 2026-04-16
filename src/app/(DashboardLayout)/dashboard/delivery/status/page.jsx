"use client";

import DeliveryAssignmentsBoard from "@/components/DashboardLayout/deliveryRoutesUI/DeliveryAssignmentsBoard";

function DeliveryStatusPage() {
  return (
    <DeliveryAssignmentsBoard
      title="Delivery Status Update"
      description="Update delivery statuses for products assigned to you."
      activeOnly={true}
      allowStatusUpdate={true}
    />
  );
}

export default DeliveryStatusPage;
