const express = require("express");
const dbConnect = require("./src/utils/config/dataBase");
const app = express();
const UserModel = require("./src/models/user.model");

const port = 3000;
// middleware to parse Json
app.use(express.json());
3;
app.post("/signup", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(200).send("User Signup successfully");
  } catch (error) {
    res.status(500).send("Internal error");
  }
});
// fetch user by email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await UserModel.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Something Went wrong");
  }
});
app.get("/userAll", async (req, res) => {
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
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (error) {
    console.log("Something Went wrong", error);
    res.status(400).send("Something Went wrong", error);
  }
});
app.patch("/user/:userId", async (req, res) => {
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
