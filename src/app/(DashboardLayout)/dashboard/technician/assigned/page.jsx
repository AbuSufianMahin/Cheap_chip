"use client";

import TechnicianAssignmentsBoard from "@/components/DashboardLayout/technicianRoutesUI/TechnicianAssignmentsBoard";

function TechnicianAssignedPage() {
  return (
    <TechnicianAssignmentsBoard
      title="Assigned Products"
      description="Products currently assigned to you for diagnosis."
      view="assigned"
      allowStatusUpdate={true}
    />
  );
}

export default TechnicianAssignedPage;
