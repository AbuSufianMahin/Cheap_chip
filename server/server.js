const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const rateLimit = require("express-rate-limit");

const port = process.env.PORT || 5000;
const app = express();

const cooldownMinutes = Number.parseInt(process.env.COOLDOWN_MIN, 10);
const hitLimitCount = Number.parseInt(process.env.HIT_LIMIT_COUNT, 10);
const windowMs = Number.isFinite(cooldownMinutes) && cooldownMinutes > 0
  ? cooldownMinutes * 60 * 1000
  : 15 * 60 * 1000;
const maxHits = Number.isFinite(hitLimitCount) && hitLimitCount > 0 ? hitLimitCount : 100;

app.set('trust proxy', 1);

// MongoDB connection
connectDB();

// middlewire
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors());

const spamController = rateLimit({
  windowMs,
  max: maxHits,
  message: {
    message: `Too many registration attempts. Please wait before your next attempt.`,
    code: "TOO_MANY_REQUESTS"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// routes
app.use("/api/authentication", spamController, require("./routes/authentication"));

// riders (deliveryman) apis
app.use("/api/riders-overview", require("./routes/ridersOverview"));

app.use("/api/deliverymen", require("./routes/deliveryman"))


// product apis
app.use("/api/product-lifecycle", require("./routes/productLifecycle"));
app.use("/api/admin", require("./routes/adminApplications"));
app.use("/api/products-info", require("./routes/allProducts"));

// Job application apis
app.use('/api/job-applications', require("./routes/jobapplication"));

app.get("/", (req, res) => {
  res.send("Running cheap chip server!");
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
