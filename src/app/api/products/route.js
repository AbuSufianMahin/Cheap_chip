export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.productName ||
      !data.productCategory ||
      !data.productCondition ||
      !data.productPrice ||
      !data.productLocation ||
      !data.productContactNumber
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Forward request to backend server
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
    const backendUrl = `${baseUrl}/api/product-lifecycle/create`;

    console.log("Sending request to:", backendUrl);
    console.log("Request data:", data);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Backend error:", result);
      return Response.json(
        { 
          message: result.message || "Backend error",
          error: result.error 
        }, 
        { status: response.status }
      );
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { 
        message: "Internal server error", 
        error: error.message,
        details: error.stack
      },
      { status: 500 }
    );
  }
}
