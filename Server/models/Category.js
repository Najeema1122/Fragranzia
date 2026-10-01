const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true
  },
  description:{
    type:String
  },
   status: {
        type: Boolean,
        default: false              //status = false → Button shows Block ✅ (category is currently unblocked, so clicking will block it)
    }
});

module.exports = mongoose.model("Category", categorySchema);