const express = require("express");
const { userAuth } = require("../utils/middlewares");
const { validateEditProfileData } = require("../utils/validations");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Input");
    }
    const loggedInUser = req.user;

    console.log("User", req.body);
    Object.keys(req.body).forEach((item) =>
      console.log((loggedInUser[item] = req.body[item]))
    );
    console.log("User", loggedInUser);
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = profileRouter;
