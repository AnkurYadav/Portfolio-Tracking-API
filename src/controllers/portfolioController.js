const service = require("../services/portfolioService");

// Get all portfolios from db in formatted json array
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await service.getPortfolio();
    res.send({ status: "OK", data: portfolio });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// Get Total returns of current portfolio
const getReturns = async (req, res) => {
  try {
    const returns = await service.getReturns();
    res.send({ status: "OK", data: returns });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getPortfolio,
  getReturns,
};
