const pool = require("../config/db");

/**
 * Create a new E-seva application
 */
exports.createApplication = async (data) => {
    const { user_id, service_type, applicant_name, applicant_details } = data;
    const [result] = await pool.query(
        `INSERT INTO eseva_applications (user_id, service_type, applicant_name, applicant_details) 
     VALUES (?, ?, ?, ?)`,
        [user_id, service_type, applicant_name, JSON.stringify(applicant_details)]
    );
    return result.insertId;
};

/**
 * Add document to an application
 */
exports.addDocument = async (applicationId, documentName, filePath) => {
    await pool.query(
        `INSERT INTO eseva_documents (application_id, document_name, file_path) 
     VALUES (?, ?, ?)`,
        [applicationId, documentName, filePath]
    );
};

/**
 * Get applications by user ID
 */
exports.getByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM eseva_applications WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};

/**
 * Get all applications (Admin/Agent)
 */
exports.getAll = async () => {
    const [rows] = await pool.query(
        `SELECT 
            ea.*, 
            u.name as user_name, u.mobile_number as user_mobile,
            a.name as admin_name,
            ag.name as agent_name
         FROM eseva_applications ea 
         JOIN users u ON ea.user_id = u.user_id 
         LEFT JOIN users a ON ea.admin_id = a.user_id
         LEFT JOIN users ag ON ea.agent_id = ag.user_id
         ORDER BY ea.created_at DESC`
    );
    return rows;
};

/**
 * Get application details with documents
 */
exports.getByIdWithDocs = async (applicationId) => {
    const [appRows] = await pool.query(
        `SELECT 
            ea.*, 
            u.name as user_name, u.mobile_number as user_mobile,
            a.name as admin_name,
            ag.name as agent_name
         FROM eseva_applications ea 
         JOIN users u ON ea.user_id = u.user_id 
         LEFT JOIN users a ON ea.admin_id = a.user_id
         LEFT JOIN users ag ON ea.agent_id = ag.user_id
         WHERE ea.application_id = ?`,
        [applicationId]
    );

    if (appRows.length === 0) return null;

    const [docRows] = await pool.query(
        `SELECT * FROM eseva_documents WHERE application_id = ?`,
        [applicationId]
    );

    return {
        ...appRows[0],
        documents: docRows
    };
};

/**
 * Update application status (Admin)
 */
exports.updateStatus = async (applicationId, adminId, status, remarks) => {
    await pool.query(
        `UPDATE eseva_applications 
     SET status = ?, admin_id = ?, admin_remarks = ? 
     WHERE application_id = ?`,
        [status, adminId, remarks, applicationId]
    );
};

/**
 * Process application (Agent)
 */
exports.processApplication = async (applicationId, agentId, remarks) => {
    await pool.query(
        `UPDATE eseva_applications 
     SET status = 'Processed', agent_id = ?, agent_remarks = ?, processed_at = NOW() 
     WHERE application_id = ?`,
        [agentId, remarks, applicationId]
    );
};
