const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { signUpValidator } = require("../utils/signUpValidator");
const validator = require("validator");
const UserModel = require("../models/user.model");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, age, password } = req.body;
    signUpValidator(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      age,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).send("User Signup successfully");
  } catch (error) {
    res.status(500).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate email format
    if (!validator.isEmail(emailId)) {
      return res.status(400).send("Invalid Credentials");
    }

    // Find the user by email
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    // Validate password
    const isPasswordValid = await user.verifyPassword(password);
    if (isPasswordValid) {
      // token creation and send to user as cookie

      const token = await user.getJWT();
      res.cookie("token", token);
      return res.status(200).send("User logged in successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    // Catch unexpected errors
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = authRouter;
