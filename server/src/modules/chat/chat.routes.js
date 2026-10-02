const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware");
const { sendChatMessage } = require("./chat.controller");

const router = express.Router();

router.post("/", authMiddleware, sendChatMessage);

module.exports = router;