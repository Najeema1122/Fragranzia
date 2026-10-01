const express = require("express");

const checkAuth = require("../middleware/authMiddleware");
const { addToAddress,getAddress,setPrimaryAddress } = require("../controllers/addressControllers");

const router = express.Router();

router.post("/add", checkAuth, addToAddress);

router.get("/", checkAuth, getAddress);

router.put("/primary/:addressId", checkAuth, setPrimaryAddress);
module.exports = router;