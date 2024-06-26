const express = require("express");
const User = require("../models/perfomanceModel");
const router = express.Router();
const { verifyToken } = require('../middleware/authmiddleware');

const {
  findAllPerfomance,
  updatePerfomance,
  loginCheck,
} = require("../controller/PerfomanceController");

router.get("/", findAllPerfomance);

router.post("/login", loginCheck);

router.patch("/:id",verifyToken, updatePerfomance);


module.exports = router;
