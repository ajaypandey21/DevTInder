const express = require("express");
const { userAuth } = require("../utils/middlewares");
const ConnectionRequests = require("../models/connectionRequests");
const UserModel = require("../models/user.model");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequests
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);
    res.status(200).json(connectionRequests);
  } catch (error) {
    res.status(400).send("Error: ", error);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const totalConnections = await connectionRequests
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = totalConnections.map((row) => {
      if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
        return row.fromUserId;
      }
      return row.toUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send("Error: ", error);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = req.query.limit || 10;
    const page = req.query.page || 1;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionsRequests = await ConnectionRequests.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hiddenUserFromFeed = new Set();
    connectionsRequests.forEach((item) => {
      hiddenUserFromFeed.add(item.fromUserId.toString());
      hiddenUserFromFeed.add(item.toUserId.toString());
    });

    const usersToFeed = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: usersToFeed });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
