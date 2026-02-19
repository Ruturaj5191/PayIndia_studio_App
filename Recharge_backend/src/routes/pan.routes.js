const express = require("express");
const router = express.Router();
const panController = require("../controllers/pan.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(authMiddleware);

// User: Submit application
router.post("/apply", panController.createApplication);

// User/Admin/Agent: List applications
router.get("/list", panController.getApplications);

// Admin: Update status (Approve/Reject)
router.put("/update-status/:applicationId", panController.updateStatus);

// Agent/Admin: Process application
router.put("/process/:applicationId", panController.processApplication);

module.exports = router;
