const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const performanceSchema = new Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    year: Number,
    company_id : Number,
    performance_metrics: {
      "Sales Revenue": Number,
      "Profit Margin": Number,
      "Customer Satisfaction": Number,
      "Market Share": Number,
      "Employee Engagement": Number,
      "Innovation Index": Number,
      "Brand Reputation": Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("perfomance", performanceSchema);
