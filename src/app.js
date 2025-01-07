const express = require("express");

const app = express();

// console.log(app);

app.use("/hello", (req, res) => {
  res.send("hello Server");
});

app.listen(3000, () => {
  console.log("Server started at 3000");
});
