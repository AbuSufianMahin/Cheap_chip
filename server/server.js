const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const rateLimit = require("express-rate-limit");

const port = process.env.PORT || 5000;
const app = express();

app.set('trust proxy', 1);

// MongoDB connection
connectDB();

// middlewire
app.use(express.json());
app.use(cors());

const spamController = rateLimit({
  windowMs: parseInt(process.env.COOLDOWN_MIN) * 60 * 1000,
  max: parseInt(process.env.HIT_LIMIT_COUNT),
  message: {
    message: `Too many registration attempts. Please wait before your next attempt.`,
    code: "TOO_MANY_REQUESTS"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// routes
app.use("/api/authentication", spamController, require("./routes/authentication"));

app.use("/api/riders-overview", require("./routes/ridersOverview"));
app.use("/api/product-lifecycle", require("./routes/productLifecycle"));

app.get("/", (req, res) => {
  res.send("Running cheap chip server!");
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
