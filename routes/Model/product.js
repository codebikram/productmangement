const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String, default: null, required: true },
  qty: { type: Number, default: null, required: true },
  price: { type: Number, default: null, required: true },
  discount: { type: Number, default: null, required: true },
});
module.exports = mongoose.model("product", productSchema);
