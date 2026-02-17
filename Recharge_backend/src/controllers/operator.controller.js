const operatorService = require("../services/paysprint/paysprint.operator");

const syncOperators = async (req, res) => {
  try {
    const result = await operatorService.syncBillOperators();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Operator sync failed",
      error: error.message
    });
  }
};

module.exports = {
  syncOperators
};
