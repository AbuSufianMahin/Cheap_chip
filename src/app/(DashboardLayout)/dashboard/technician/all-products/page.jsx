"use client";

import TechnicianAssignmentsBoard from "@/components/DashboardLayout/technicianRoutesUI/TechnicianAssignmentsBoard";

function TechnicianAllProductsPage() {
  return (
    <TechnicianAssignmentsBoard
      title="All Products"
      description="View every product assigned to you, active or completed."
      view="all"
      allowStatusUpdate={true}
    />
  );
}

export default TechnicianAllProductsPage;
