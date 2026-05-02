function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildEmailMatcher(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const escapedEmail = escapeRegex(normalizedEmail);
  return {
    $regex: new RegExp(`^${escapedEmail}$`, "i"),
  };
}

async function getApprovedRoleForEmail(db, email) {
  if (!email) {
    return null;
  }

  const emailMatcher = buildEmailMatcher(email);

  const approvedTechnicianInfo = await db.collection("technician-info").findOne({
    email: emailMatcher,
    isActive: true,
  });

  if (approvedTechnicianInfo) {
    return "technician";
  }

  const approvedTechnician = await db.collection("technicianApplications").findOne({
    email: emailMatcher,
    status: "approved",
  });

  if (approvedTechnician) {
    return "technician";
  }

  const approvedDeliveryInfo = await db.collection("deliveryman-info").findOne({
    email: emailMatcher,
    isActive: true,
  });

  if (approvedDeliveryInfo) {
    return "deliveryman";
  }

  const approvedDelivery = await db.collection("deliverymanApplications").findOne({
    email: emailMatcher,
    status: "approved",
  });

  if (approvedDelivery) {
    return "deliveryman";
  }

  return null;
}

module.exports = getApprovedRoleForEmail;