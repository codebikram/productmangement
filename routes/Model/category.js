const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String, default: null, required: true
  },
  status: { type: String, default: null, required: true }, //Y=active,N=inactive,T-trash
});
module.exports = mongoose.model("category", categorySchema);
