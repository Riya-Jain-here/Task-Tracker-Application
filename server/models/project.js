const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
});
module.exports = mongoose.model("Project", projectSchema);
