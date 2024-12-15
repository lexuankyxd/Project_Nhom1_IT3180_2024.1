const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  console.log(req.body);
  res.status(200).json({ token: "dangnhapthanhcong" });
});

module.exports = router;
