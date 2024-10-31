const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const dbConnect = async () => {
  mongoose.connect(process.env.MONGO_URL);
};

module.exports = dbConnect;
