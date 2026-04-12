import { auth } from "../../../../../auth.js";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function isAdmin(session) {
  return session?.user?.role === "admin";
}

async function proxyJsonResponse(response) {
  const payload = await response.json();
  return Response.json(payload, { status: response.status });
}

export async function GET() {
  const session = await auth();

  if (!isAdmin(session)) {
    return Response.json({ message: "Admin access required" }, { status: 403 });
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/admin/job-applications`);

    return proxyJsonResponse(response);
  } catch (error) {
    return Response.json(
      { message: "Failed to load applications", error: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  const session = await auth();

  if (!isAdmin(session)) {
    return Response.json({ message: "Admin access required" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const { applicationType, applicationId, status } = payload;

    if (!applicationType || !applicationId || !status) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_BASE_URL}/api/admin/job-applications/${applicationType}/${applicationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        reviewedBy: session.user.email,
      }),
    });

    return proxyJsonResponse(response);
  } catch (error) {
    return Response.json(
      { message: "Failed to update application", error: error.message },
      { status: 500 },
    );
  }
}