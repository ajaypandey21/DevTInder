const express = require("express");
const dbConnect = require("./src/utils/config/dataBase");
const app = express();
const UserModel = require("./src/models/user.model");

const port = 3000;
app.post("/signup", async (req, res) => {
  try {
    const user = new UserModel({
      firstName: "Ajay",
      lastName: "pandey",
      email: "paja7686@gmail.com",
      gender: "male",
    });
    await user.save();
    res.status(200).send("User Signup sucessfully");
  } catch (error) {
    res.status(500).send("Internal error");
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
