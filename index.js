const express = require("express");
const dbConnect = require("./src/config/dataBase");
const app = express();
var cookieParser = require("cookie-parser");
const port = 3000;

app.use(express.json());
app.use(cookieParser());

const profileRouter = require("./src/routes/profile.route");
const requestRouter = require("./src/routes/request.route");
const userAuthRouter = require("./src/routes/userAuth.route");
app.use("/", userAuthRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

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
