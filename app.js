// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const { PORT, MONGO_URL, NODE_ENV } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB")) // eslint-disable-line no-console
  .catch((err) => console.error("Could not connect to MongoDB", err)); // eslint-disable-line no-console

app.use(
  cors({
    origin: ["http://localhost:3000"], // adding frontend origin
    credentials: false, // (true if I switch to cookies later)
  })
);
app.use(express.json());

app.use("/", mainRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // eslint-disable-line no-console
});
