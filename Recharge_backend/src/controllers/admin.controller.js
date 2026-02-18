const pool = require("../config/db");

exports.getStats = async (req, res) => {
  const [[users]] = await pool.query("SELECT COUNT(*) total FROM users");
  const [[txns]] = await pool.query("SELECT COUNT(*) total FROM transactions");
  const [[aadharPending]] = await pool.query("SELECT COUNT(*) total FROM aadhar_enrollments WHERE status = 'Pending'");
  const [[esevaPending]] = await pool.query("SELECT COUNT(*) total FROM eseva_applications WHERE status = 'Pending'");

  res.json({
    totalUsers: users.total,
    totalTransactions: txns.total,
    pendingAadharApprovals: aadharPending.total,
    pendingEsevaApprovals: esevaPending.total,
  });
};
