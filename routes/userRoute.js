
const express = require("express");
const router = express.Router();
require('dotenv').config();
const { register, login, update, deleteUser } = require("../controllers/userController");
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/update").put(update);
router.route("/deleteUser").delete(deleteUser);
module.exports = router;
