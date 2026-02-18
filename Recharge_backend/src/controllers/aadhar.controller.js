const AadharModel = require("../models/aadhar.model");

/**
 * Submit a new Aadhar enrollment
 */
exports.createEnrollment = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const enrollmentData = { ...req.body, user_id: userId };

        const enrollmentId = await AadharModel.create(enrollmentData);

        res.status(201).json({
            success: true,
            message: "Aadhar enrollment submitted successfully",
            data: { enrollmentId },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get enrollments based on user role
 */
exports.getEnrollments = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        let enrollments;

        if (role === "ADMIN" || role === "AGENT") {
            enrollments = await AadharModel.getAll();
        } else {
            enrollments = await AadharModel.getByUserId(userId);
        }

        res.json({
            success: true,
            data: enrollments,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin: Update enrollment status (Approve/Reject)
 */
exports.updateStatus = async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;
        const { status, remarks } = req.body;
        const adminId = req.user.userId;

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Admin access only" });
        }

        await AadharModel.updateStatus(enrollmentId, adminId, status, remarks);

        res.json({
            success: true,
            message: `Enrollment ${status} successfully`,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Agent: Process/Finalize enrollment
 */
exports.processEnrollment = async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;
        const { remarks } = req.body;
        const agentId = req.user.userId;

        if (req.user.role !== "AGENT" && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Agent access only" });
        }

        const enrollment = await AadharModel.getById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        if (enrollment.status !== "Approved") {
            return res.status(400).json({ message: "Only approved enrollments can be processed" });
        }

        await AadharModel.processEnrollment(enrollmentId, agentId, remarks);

        res.json({
            success: true,
            message: "Enrollment processed successfully",
        });
    } catch (err) {
        next(err);
    }
};
