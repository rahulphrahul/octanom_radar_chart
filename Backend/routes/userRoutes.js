const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const { verifyToken } = require('../middleware/authmiddleware');

const {
  findAllPerfomance,
  updatePerfomance,
  loginCheck,
} = require("../controller/userController");

router.get("/", findAllPerfomance);

router.post("/login", loginCheck);

router.patch("/:id",verifyToken, updatePerfomance);


module.exports = router;
