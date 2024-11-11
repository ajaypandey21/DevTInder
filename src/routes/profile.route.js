const express = require("express");
const UserModel = require("../models/user.model");
const { userAuth } = require("../utils/middlewares");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = profileRouter;
