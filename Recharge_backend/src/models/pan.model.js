const pool = require("../config/db");

/**
 * Create a new PAN application
 */
exports.create = async (data) => {
    const {
        user_id,
        full_name,
        father_name,
        mother_name,
        date_of_birth,
        mobile_number,
        email_address,
        aadhar_number,
        full_address,
        city,
        pincode,
    } = data;

    const [result] = await pool.query(
        `INSERT INTO pan_applications 
     (user_id, full_name, father_name, mother_name, date_of_birth, mobile_number, email_address, aadhar_number, full_address, city, pincode) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            full_name,
            father_name,
            mother_name,
            date_of_birth,
            mobile_number,
            email_address,
            aadhar_number,
            full_address,
            city,
            pincode,
        ]
    );
    return result.insertId;
};

/**
 * Get all PAN applications (Admin/Agent view)
 */
exports.getAll = async () => {
    const [rows] = await pool.query(
        `SELECT 
            pa.*, 
            u.name as user_name, u.mobile_number as user_mobile,
            a.name as admin_name,
            ag.name as agent_name
         FROM pan_applications pa 
         JOIN users u ON pa.user_id = u.user_id 
         LEFT JOIN users a ON pa.admin_id = a.user_id
         LEFT JOIN users ag ON pa.agent_id = ag.user_id
         ORDER BY pa.created_at DESC`
    );
    return rows;
};

/**
 * Get PAN applications by user ID
 */
exports.getByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM pan_applications WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};

/**
 * Get PAN application by ID
 */
exports.getById = async (applicationId) => {
    const [rows] = await pool.query(
        `SELECT 
            pa.*, 
            u.name as user_name, u.mobile_number as user_mobile,
            a.name as admin_name,
            ag.name as agent_name
         FROM pan_applications pa 
         JOIN users u ON pa.user_id = u.user_id 
         LEFT JOIN users a ON pa.admin_id = a.user_id
         LEFT JOIN users ag ON pa.agent_id = ag.user_id
         WHERE pa.application_id = ?`,
        [applicationId]
    );
    return rows[0];
};

/**
 * Update PAN application status (Admin Approval)
 */
exports.updateStatus = async (applicationId, adminId, status, remarks) => {
    await pool.query(
        `UPDATE pan_applications 
     SET status = ?, admin_id = ?, admin_remarks = ? 
     WHERE application_id = ?`,
        [status, adminId, remarks, applicationId]
    );
};

/**
 * Process PAN application (Agent Finalization)
 */
exports.processApplication = async (applicationId, agentId, remarks) => {
    await pool.query(
        `UPDATE pan_applications 
     SET status = 'Processed', agent_id = ?, agent_remarks = ?, processed_at = NOW() 
     WHERE application_id = ?`,
        [agentId, remarks, applicationId]
    );
};
