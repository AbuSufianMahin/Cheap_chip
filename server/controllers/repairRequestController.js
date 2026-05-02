const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");

function generateTrackingId() {
  return Math.floor(Math.random() * 900000) + 100000; // 100000–999999
}
const createRepairRequest = async (req, res) => {
  try {
    const body = req.body;
    console.log('Received repair request:', body);
 
    // Validate required fields
    const { productType, condition, problems } = body;
    if (!productType || !condition || !problems || problems.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: productType, condition, problems',
      });
    }
 
    const { db }  = await connectDB();
 
    if (!db) {
      console.error('Database connection failed');
      return res.status(500).json({ message: 'Database connection failed' });
    }
 
    const repairRequestsCollection = db.collection('repair_requests');
 
    // Generate unique tracking ID (with retry logic)
    let trackingId;
    const maxRetries = 10;
    let retries = 0;
 
    while (retries < maxRetries) {
      trackingId = generateTrackingId().toString();
      const existing = await repairRequestsCollection.findOne({ trackingId });
      if (!existing) break;
      retries++;
    }
 
    if (retries === maxRetries) {
      return res.status(500).json({ message: 'Failed to generate unique tracking ID' });
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
 
    const result = await repairRequestsCollection.insertOne(repairRequest);
    console.log('Repair request saved:', result.insertedId);
 
    return res.status(200).json({
      success: true,
      trackingId,
      repairId: result.insertedId,
      message: 'Repair request submitted successfully',
    });
  } catch (error) {
    console.error('createRepairRequest error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
 
const getRepairRequest = async (req, res) => {
  try {
    const { trackingId } = req.query;
 
    if (!trackingId) {
      return res.status(400).json({ message: 'trackingId query parameter required' });
    }
 
    console.log('Fetching repair request with tracking ID:', trackingId);
 
    const { db } = await connectDB();
 
    if (!db) {
      console.error('Database connection failed');
      return res.status(500).json({ message: 'Database connection failed' });
    }
 
    const repairRequestsCollection = db.collection('repair_requests');
    const repairRequest = await repairRequestsCollection.findOne({
      trackingId: trackingId.toString(),
    });
 
    if (!repairRequest) {
      return res.status(404).json({ message: 'Repair request not found' });
    }
 
    console.log('Found repair request:', repairRequest);
 
    return res.status(200).json({ success: true, data: repairRequest });
  } catch (error) {
    console.error('getRepairRequest error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

module.exports = { 
createRepairRequest,
getRepairRequest 
};
