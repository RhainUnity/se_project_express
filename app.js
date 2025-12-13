// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT, MONGO_URL } = process.env;

// --- DB ---
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB")) // eslint-disable-line no-console
  .catch((err) => console.error("Could not connect to MongoDB", err)); // eslint-disable-line no-console

// --- CORS ---
const allowedOrigins = [
  "http://localhost:3000",
  "https://jrsttwtwr2025.twilightparadox.com",
  "https://www.jrsttwtwr2025.twilightparadox.com",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser clients (no Origin) + our allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false, // set to true if you ever switch to cookies
  })
);

app.use(express.json());

// log requests *before* routes (optional but nice)
app.use(requestLogger);

// routes
app.use("/", mainRouter);

// log errors
app.use(errorLogger);

// celebrate errors
app.use(errors());

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // eslint-disable-line no-console
});
