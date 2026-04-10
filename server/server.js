const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");

const port = 5000;
const app = express();

// MongoDB connection
connectDB();

// middlewire
app.use(express.json());
app.use(cors());

// routes
app.use("/api/authentication", require("./routes/authentication"));

app.use("/api/riders-overview", require("./routes/ridersOverview"));
app.use("/api/product-lifecycle", require("./routes/productLifecycle"));
// Job application apis
app.use('/api/job-applications', require("./routes/jobapplication"));
app.get("/", (req, res) => {
  res.send("Running cheap chip server!");
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
