const express = require("express");
const router = express.Router();
const esevaController = require("../controllers/eseva.controller");
const auth = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "src/uploads/eseva";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All routes protected
router.use(auth);

// Submit application (allows multiple files)
router.post("/apply", upload.any(), esevaController.submitApplication);

// List applications
router.get("/list", esevaController.getApplications);

// Application details
router.get("/details/:id", esevaController.getApplicationDetails);

// Admin: Update status
router.put("/update-status/:id", esevaController.updateStatus);

// Agent: Process
router.put("/process/:id", esevaController.processApplication);

module.exports = router;
