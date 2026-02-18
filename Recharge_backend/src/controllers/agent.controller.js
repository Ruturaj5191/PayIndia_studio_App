const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  const [[aadharApproved]] = await pool.query("SELECT COUNT(*) total FROM aadhar_enrollments WHERE status = 'Approved'");
  const [[esevaApproved]] = await pool.query("SELECT COUNT(*) total FROM eseva_applications WHERE status = 'Approved'");

  res.json({
    message: "Agent dashboard data",
    approvedAadharRequests: aadharApproved.total,
    approvedEsevaRequests: esevaApproved.total,
  });
};
