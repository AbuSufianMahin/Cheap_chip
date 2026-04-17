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

  const approvedTechnician = await db.collection("technicianApplications").findOne({
    email: emailMatcher,
    status: "approved",
  });

  if (approvedTechnician) {
    return "technician";
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