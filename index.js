const express = require("express");
const PORT = process.env.PORT || 5000;
const authRouter = require(".//Users/authRouter");
const serviceRouter = require(".//Service/authRouter");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/auth", serviceRouter);
const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://oxotnik:4759frost@cluster0.ze7hfmd.mongodb.net/StoHelper`
    );
    app.listen(PORT, () => console.log(`server start${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();
