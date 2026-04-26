import connectDB from '@/lib/connectDB';

function generateTrackingId() {
  return Math.floor(Math.random() * 900000) + 100000; // 100000-999999
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received repair request:', body);

    // Validate required fields
    const { productType, condition, problems } = body;
    if (!productType || !condition || !problems || problems.length === 0) {
      return Response.json(
        { message: 'Missing required fields: productType, condition, problems' },
        { status: 400 }
      );
    }

    // Connect to database
    const dbConnection = await connectDB();
    const db = dbConnection.db;

    if (!db) {
      console.error('Database connection failed');
      return Response.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const repairRequestsCollection = db.collection('repair_requests');

    // Generate unique tracking ID (with retry logic)
    let trackingId;
    let maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      trackingId = generateTrackingId().toString();
      const existing = await repairRequestsCollection.findOne({ trackingId });
      if (!existing) break;
      retries++;
    }

    if (retries === maxRetries) {
      return Response.json(
        { message: 'Failed to generate unique tracking ID' },
        { status: 500 }
      );
    }

    console.log('Generated tracking ID:', trackingId);

    // Create repair request document
    const repairRequest = {
      trackingId,
      productType: body.productType,
      productModel: body.productModel || 'Not specified',
      condition: body.condition,
      usageMonths: body.usageMonths || 'Not specified',
      releaseYear: body.releaseYear || 'Not specified',
      problems: body.problems,
      estimatedDays: body.estimatedDays,
      estimatedPrice: body.estimatedPrice,
      estimatedCompletionDate: body.estimatedCompletionDate,
      additionalDetails: body.additionalDetails || '',
      status: 'submitted',
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date(),
          message: 'Your repair request has been submitted successfully',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await repairRequestsCollection.insertOne(repairRequest);
    console.log('Repair request saved:', result.insertedId);

    return Response.json(
      {
        success: true,
        trackingId,
        repairId: result.insertedId,
        message: 'Repair request submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/repair-requests error:', error);
    return Response.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get('trackingId');

    if (!trackingId) {
      return Response.json(
        { message: 'trackingId query parameter required' },
        { status: 400 }
      );
    }

    console.log('Fetching repair request with tracking ID:', trackingId);

    // Connect to database
    const dbConnection = await connectDB();
    const db = dbConnection.db;

    if (!db) {
      console.error('Database connection failed');
      return Response.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const repairRequestsCollection = db.collection('repair_requests');
    const repairRequest = await repairRequestsCollection.findOne({
      trackingId: trackingId.toString(),
    });

    if (!repairRequest) {
      return Response.json(
        { message: 'Repair request not found' },
        { status: 404 }
      );
    }

    console.log('Found repair request:', repairRequest);

    return Response.json(
      {
        success: true,
        data: repairRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/repair-requests error:', error);
    return Response.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
