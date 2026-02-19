const PanModel = require("../models/pan.model");

/**
 * Submit a new PAN application
 */
exports.createApplication = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const applicationData = { ...req.body, user_id: userId };

        const applicationId = await PanModel.create(applicationData);

        res.status(201).json({
            success: true,
            message: "PAN application submitted successfully",
            data: { applicationId },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get PAN applications based on user role
 */
exports.getApplications = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        let applications;

        if (role === "ADMIN" || role === "AGENT") {
            applications = await PanModel.getAll();
        } else {
            applications = await PanModel.getByUserId(userId);
        }

        res.json({
            success: true,
            data: applications,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin: Update application status (Approve/Reject)
 */
exports.updateStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { status, remarks } = req.body;
        const adminId = req.user.userId;

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        await PanModel.updateStatus(applicationId, adminId, status, remarks);

        res.json({
            success: true,
            message: `Application ${status} successfully`,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Agent: Process/Finalize application
 */
exports.processApplication = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { remarks } = req.body;
        const agentId = req.user.userId;

        if (req.user.role !== "AGENT" && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Agent access only" });
        }

        const application = await PanModel.getById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.status !== "Approved") {
            return res.status(400).json({ message: "Only approved applications can be processed" });
        }

        await PanModel.processApplication(applicationId, agentId, remarks);

        res.json({
            success: true,
            message: "Application processed successfully",
        });
    } catch (err) {
        next(err);
    }
};
