const { ObjectId } = require("mongodb");
const connectDB = require("../utils/db");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY_BACKEND);

const DELIVERY_EMPLOYEES = "deliveryman-info";
const PAY_PER_DELIVERY = 10;

const getAllEmployeeInfo = async (req, res) => {
  try {
    const { db } = await connectDB();

    const now = new Date();
    const BD_OFFSET = 6 * 60 * 60 * 1000;
    const nowBD = new Date(now.getTime() + BD_OFFSET);
    const year = nowBD.getUTCFullYear();
    const month = nowBD.getUTCMonth();
    const startOfMonth = new Date(Date.UTC(year, month, 1) - BD_OFFSET);
    const endOfMonth = new Date(Date.UTC(year, month + 1, 1) - BD_OFFSET);

    const periodLabel = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const employees = await db
      .collection(DELIVERY_EMPLOYEES)
      .aggregate([
        {
          $addFields: {
            thisMonthDeliveries: {
              $size: {
                $filter: {
                  input: "$completedDeliveries",
                  as: "delivery",
                  cond: {
                    $and: [
                      { $gte: ["$$delivery.completedAt", startOfMonth] },
                      { $lt: ["$$delivery.completedAt", endOfMonth] },
                    ],
                  },
                },
              },
            },
            totalCompletedDeliveries: {
              $size: { $ifNull: ["$completedDeliveries", []] },
            },
            // check if already paid this period
            alreadyPaidThisMonth: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$paymentHistory", []] },
                      as: "payment",
                      cond: { $eq: ["$$payment.period", periodLabel] },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          // only unpaid employees with deliveries this month
          $match: {
            thisMonthDeliveries: { $gt: 0 },
            alreadyPaidThisMonth: false,
          },
        },
        {
          $addFields: {
            payableAmount: {
              $multiply: ["$thisMonthDeliveries", PAY_PER_DELIVERY],
            },
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            phone: 1,
            isActive: 1,
            stripeID: { $ifNull: ["$stripeID", null] },
            thisMonthDeliveries: 1,
            payableAmount: 1,
          },
        },
      ])
      .toArray();

    return res.json({
      success: true,
      periodLabel,
      employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const payEmployee = async (req, res) => {
  try {
    const employee = req.body;
    const now = new Date();
    const periodLabel = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const { db } = await connectDB();
    await db.collection(DELIVERY_EMPLOYEES).updateOne(
      { _id: new ObjectId(req.params.employeeID) },
      {
        $push: {
          paymentHistory: {
            transactionId: employee.transactionId,
            amount: employee.payableAmount,
            deliveriesCount: employee.thisMonthDeliveries,
            period: periodLabel,
            paidAt: new Date(),
          },
        },
      },
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const amountInCents = parseFloat(req.body.amount) * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllEmployeeInfo,
  payEmployee,
  createPaymentIntent,
};
