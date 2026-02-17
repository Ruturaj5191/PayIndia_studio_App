const express = require("express");
const router = express.Router();
const operatorController = require("../controllers/operator.controller");

router.post("/sync-bill-operators", operatorController.syncOperators);

module.exports = router;

