const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "dist/expenseapp")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist/expenseapp", "index.html"));
});

app.listen(3001, () => {
  console.log("Server started !!! at " + 3001);
});