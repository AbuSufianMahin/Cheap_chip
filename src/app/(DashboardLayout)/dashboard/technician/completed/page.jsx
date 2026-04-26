"use client";

import TechnicianAssignmentsBoard from "@/components/DashboardLayout/technicianRoutesUI/TechnicianAssignmentsBoard";

function TechnicianCompletedPage() {
  return (
    <TechnicianAssignmentsBoard
      title="Completed Jobs"
      description="Products already marked as repaired or can't be repaired."
      view="completed"
      allowStatusUpdate={false}
    />
  );
}

export default TechnicianCompletedPage;
