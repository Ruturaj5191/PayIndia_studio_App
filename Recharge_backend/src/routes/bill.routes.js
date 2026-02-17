const express = require("express");
const router = express.Router();
const billController = require("../controllers/bill.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/operators", auth, billController.getOperators);
router.post("/fetch", auth, billController.fetchBill);
router.post("/pay", auth, billController.payBill);
router.post("/status", auth, billController.statusEnquiry);

module.exports = router;
