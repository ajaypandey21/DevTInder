const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionReqSchema = new Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
});

connectionReqSchema.pre("save", function () {
  // middleWare to not req to suer itself
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You cant send request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionReqSchema);
