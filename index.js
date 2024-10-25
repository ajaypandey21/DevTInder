const express = require("express");
const app = express();

const port = 3000;
app.use("/", (req, res) => {
  res.send("Hello from homepage");
});

app.use("/hello", (req, res) => {
  res.send("Hello from hello");
});
app.use("/test", (req, res) => {
  res.send("Hello from test");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
