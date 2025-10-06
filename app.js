const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB")) // eslint-disable-line no-console
  .catch((err) => console.error("Could not connect to MongoDB", err)); // eslint-disable-line no-console

app.use(express.json());

/////////////////////
///////////////////
// app.use((req, res, next) => {
//   // put a real ObjectId from your users collection here
//   req.user = { _id: "66f1e8c2b7f2b1a1c8c12345" };
//   next();
// });
/////////////////////
///////////////////

app.use("/", mainRouter);
//
//

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // eslint-disable-line no-console
});
