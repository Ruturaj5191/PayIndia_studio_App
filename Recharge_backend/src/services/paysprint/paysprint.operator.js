const pool = require("../../config/db");
const { instance, getHeaders } = require("./paysprint.helper");

const syncBillOperators = async () => {
  try {
    const response = await instance.get(
      "/bill-payment/bill/getoperator",
      { headers: getHeaders() }
    );

    const data = response.data;

    console.log("PaySprint Operator Response:");

    if (!data || data.status !== true) {
      throw new Error(data?.message || "Failed to fetch operators");
    }

    const operators = data.data;

for (const op of operators) {

  if (!op.id || !op.name) {
    console.log("Skipping invalid operator:", op);
    continue;
  }

  await pool.query(
    `INSERT INTO operators 
    (operator_code, operator_name, service_type, is_active, category)
    VALUES (?, ?, ?, 1, ?)
    ON DUPLICATE KEY UPDATE
      operator_name = VALUES(operator_name),
      category = VALUES(category),
      is_active = 1`,
    [
      op.id,                 // ✅ FIXED (was operator_code)
      op.name,               // ✅ FIXED (was operator_name)
      'BILL',
      op.category || 'BILL'
    ]
  );
}

const values = operators.map(op => [
  op.id,
  op.name,
  'BILL',
  1,
  op.category || 'BILL'
]);

await pool.query(
  `INSERT INTO operators
  (operator_code, operator_name, service_type, is_active, category)
  VALUES ?
  ON DUPLICATE KEY UPDATE
    operator_name = VALUES(operator_name),
    category = VALUES(category),
    is_active = 1`,
  [values]
);


    return {
      message: "Bill operators synced successfully",
      total: operators
    };

  } catch (error) {
    console.error(
      "Operator Sync Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = {
  syncBillOperators
};
