const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function POST(request) {
  try {
    const payload = await request.json();

    const response = await fetch(`${BACKEND_BASE_URL}/api/job-applications/delivery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json(
      { message: "Failed to submit delivery application", error: error.message },
      { status: 500 },
    );
  }
}