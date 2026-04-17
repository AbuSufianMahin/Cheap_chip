"use client";

import DeliveryAssignmentsBoard from "@/components/DashboardLayout/deliveryRoutesUI/DeliveryAssignmentsBoard";

function AssignedDeliveriesPage() {
  return (
    <DeliveryAssignmentsBoard
      title="Assigned Deliveries"
      description="Products currently assigned to you for delivery."
      activeOnly={true}
      allowStatusUpdate={false}
    />
  );
}

export default AssignedDeliveriesPage;
