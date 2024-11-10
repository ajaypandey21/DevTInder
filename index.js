const express = require("express");
const dbConnect = require("./src/config/dataBase");
const bcrypt = require("bcrypt");
const app = express();
const UserModel = require("./src/models/user.model");
const { signUpValidator } = require("./src/utils/signUpValidator");
const validator = require("validator");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const { userAuth } = require("./src/utils/middlewares");

const port = 3000;
// middleware to parse Json
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // token creation and send to user as cookie

      const token = jwt.sign(
        {
          id: user._id,
        },
        "JwtSecretKey1234",
        { expiresIn: "1h" }
      );
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

// fetch user by email
app.get("/user", userAuth, async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await UserModel.find({ email: userEmail });
    if (user.length === 0) {
      throw new Error("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Error:", error.message);
  }
});
app.get("/feed", userAuth, async (req, res) => {
  try {
    const user = await UserModel.find();
    if (user.length === 0) {
      res.status(404).send("users not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Something Went wrong");
  }
});
app.delete("/delete", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (error) {
    console.log("Something Went wrong", error);
    res.status(400).send("Something Went wrong", error);
  }
});
app.patch("/user/:userId", userAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    await UserModel.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated Successfully");
  } catch (error) {
    console.log("Something Went wrong", error);
    res.status(400).send("Something Went wrong" + error.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

dbConnect()
  .then(() => {
    console.log("Database Connection Established");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error at connecting to database", err);
  });
