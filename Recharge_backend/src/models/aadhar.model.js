const pool = require("../config/db");

/**
 * Create a new Aadhar enrollment
 */
exports.create = async (data) => {
    const {
        user_id,
        full_name,
        date_of_birth,
        gender,
        house_no_street,
        area_village_locality,
        city_taluka,
        district,
        state,
        pincode,
        mobile_number,
    } = data;

    const [result] = await pool.query(
        `INSERT INTO aadhar_enrollments 
     (user_id, full_name, date_of_birth, gender, house_no_street, area_village_locality, city_taluka, district, state, pincode, mobile_number) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            full_name,
            date_of_birth,
            gender,
            house_no_street,
            area_village_locality,
            city_taluka,
            district,
            state,
            pincode,
            mobile_number,
        ]
    );
    return result.insertId;
};

/**
 * Get all enrollments (Admin/Agent view)
 */
exports.getAll = async () => {
    const [rows] = await pool.query(
        `SELECT 
            ae.*, 
            u.name as user_name, u.mobile_number as user_mobile,
            a.name as admin_name,
            ag.name as agent_name
         FROM aadhar_enrollments ae 
         JOIN users u ON ae.user_id = u.user_id 
         LEFT JOIN users a ON ae.admin_id = a.user_id
         LEFT JOIN users ag ON ae.agent_id = ag.user_id
         ORDER BY ae.created_at DESC`
    );
    return rows;
};

/**
 * Get enrollments by user ID
 */
exports.getByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM aadhar_enrollments WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};

/**
 * Get enrollment by ID
 */
exports.getById = async (enrollmentId) => {
    const [rows] = await pool.query(
        `SELECT 
            ae.*, 
            u.name as user_name, u.mobile_number as user_mobile,
            a.name as admin_name,
            ag.name as agent_name
         FROM aadhar_enrollments ae 
         JOIN users u ON ae.user_id = u.user_id 
         LEFT JOIN users a ON ae.admin_id = a.user_id
         LEFT JOIN users ag ON ae.agent_id = ag.user_id
         WHERE ae.enrollment_id = ?`,
        [enrollmentId]
    );
    return rows[0];
};

/**
 * Update enrollment status (Admin Approval)
 */
exports.updateStatus = async (enrollmentId, adminId, status, remarks) => {
    await pool.query(
        `UPDATE aadhar_enrollments 
     SET status = ?, admin_id = ?, admin_remarks = ? 
     WHERE enrollment_id = ?`,
        [status, adminId, remarks, enrollmentId]
    );
};

/**
 * Process enrollment (Agent Finalization)
 */
exports.processEnrollment = async (enrollmentId, agentId, remarks) => {
    await pool.query(
        `UPDATE aadhar_enrollments 
     SET status = 'Processed', agent_id = ?, agent_remarks = ?, processed_at = NOW() 
     WHERE enrollment_id = ?`,
        [agentId, remarks, enrollmentId]
    );
};
