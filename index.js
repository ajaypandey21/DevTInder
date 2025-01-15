const express = require("express");
const dbConnect = require("./src/config/dataBase");
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");
const http = require("http");
const port = 7777;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const profileRouter = require("./src/routes/profile.route");
const requestRouter = require("./src/routes/request.route");
const userAuthRouter = require("./src/routes/userAuth.route");
const userRouter = require("./src/routes/user.route");
const paymentRouter = require("./src/routes/payment.route");
const initializeSocket = require("./src/utils/socket");

app.use("/", userAuthRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

const server = http.createServer(app);
initializeSocket(server);

dbConnect()
  .then(() => {
    console.log("Database Connection Established");
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error at connecting to database", err);
  });
