const EsevaModel = require("../models/eseva.model");
const requirements = require("../config/esevaRequirements");
const path = require("path");
const fs = require("fs");

/**
 * Submit a new E-seva application
 */
exports.submitApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { service_type, applicant_name, applicant_details } = req.body;

        // Validate if service_type exists in requirements
        if (!requirements[service_type]) {
            return res.status(400).json({ message: "Invalid service type" });
        }

        // Check if all required documents are present in req.files
        const requiredDocs = requirements[service_type];
        const uploadedDocs = req.files.map(f => f.fieldname);

        const missingDocs = requiredDocs.filter(doc => !uploadedDocs.includes(doc));

        if (missingDocs.length > 0) {
            // Cleanup any files that were uploaded before failing
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            return res.status(400).json({
                message: "Missing required documents",
                missingDocuments: missingDocs
            });
        }

        // Create application record
        const applicationId = await EsevaModel.createApplication({
            user_id: userId,
            service_type,
            applicant_name,
            applicant_details: typeof applicant_details === 'string' ? JSON.parse(applicant_details) : applicant_details
        });

        // Handle uploaded documents
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Use fieldname as document name if available, else originalname
                const documentName = file.fieldname || file.originalname;
                await EsevaModel.addDocument(applicationId, documentName, file.path);
            }
        }

        res.status(201).json({
            success: true,
            message: `${service_type.replace('_', ' ')} applied successfully`,
            data: { applicationId }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get applications based on role
 */
exports.getApplications = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        let applications;

        if (role === 'ADMIN' || role === 'AGENT') {
            applications = await EsevaModel.getAll();
        } else {
            applications = await EsevaModel.getByUserId(userId);
        }

        res.json({
            success: true,
            data: applications
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get application details
 */
exports.getApplicationDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await EsevaModel.getByIdWithDocs(id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Security check: only owner, admin, or agent can see details
        if (req.user.role === 'USER' && application.user_id !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin: Update status (Approve/Reject)
 */
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        const adminId = req.user.userId;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Admin access only" });
        }

        await EsevaModel.updateStatus(id, adminId, status, remarks);

        res.json({
            success: true,
            message: `Status updated to ${status}`
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Agent: Process application
 */
exports.processApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;
        const agentId = req.user.userId;

        if (req.user.role !== 'AGENT' && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Agent or Admin access only" });
        }

        await EsevaModel.processApplication(id, agentId, remarks);

        res.json({
            success: true,
            message: "Application processed successfully"
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get document requirements for all services
 */
exports.getRequirements = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: requirements
        });
    } catch (err) {
        next(err);
    }
};
