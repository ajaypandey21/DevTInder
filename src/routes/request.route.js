const express = require("express");
const requestRouter = express.Router();
requestRouter.post("/sendConnectionRequest", (req, res) => {
  try {
    res.send(200).send("connection sent successfully");
  } catch (error) {}
});
module.exports = requestRouter;
