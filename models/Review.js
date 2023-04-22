const { Schema, model } = require("mongoose");

const Review = new Schema({
  review: { type: String, required: true },
  userName: { type: String, required: true },
});

module.exports = model("review", Review);
