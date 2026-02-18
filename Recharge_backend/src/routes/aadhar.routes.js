const express = require("express");
const router = express.Router();
const aadharController = require("../controllers/aadhar.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(authMiddleware);

// User: Submit enrollment
router.post("/enroll", aadharController.createEnrollment);

// User/Admin/Agent: List enrollments
router.get("/list", aadharController.getEnrollments);

// Admin: Update status (Approve/Reject)
router.put("/update-status/:enrollmentId", aadharController.updateStatus);

// Agent/Admin: Process enrollment
router.put("/process/:enrollmentId", aadharController.processEnrollment);

module.exports = router;
