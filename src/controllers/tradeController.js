const service = require("../services/tradeService");

// Get all trades in db in formatted json array
const getAllTrades = async (req, res) => {
  try {
    const allTrades = await service.getAllTrades();
    res.send({ status: "OK", data: allTrades });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// Get single trade from db in formatted json
const getOneTrade = async (req, res) => {
  // extract trade Id of the trade to get
  const {
    params: { tradeId },
  } = req;
  if (!tradeId) {
    return;
  }
  try {
    const trade = await service.getOneTrade(tradeId);
    res.send({ status: "OK", data: trade });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// Add a new trade in db and update portfolio
const createNewTrade = async (req, res) => {
  const { body } = req;
  // check if required data is present
  if (!body.type || !body.ticker || !body.price || !body.quantity) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'type', 'ticker', 'price', 'quantity'",
      },
    });
    return;
  }
  try {
    const createdTrade = await service.createNewTrade(body);
    res.status(201).send({ status: "OK", data: createdTrade });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// Update existing trade data and portfolio
const updateOneTrade = async (req, res) => {
  // extract trade Id and changes of the trade to update
  const {
    body,
    params: { tradeId },
  } = req;
  if (!tradeId) {
    return;
  }
  try {
    const updatedTrade = await service.updateOneTrade(tradeId, body);
    res.send({ status: "OK", data: updatedTrade });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

// Delete existing trade and revert portfolio
const deleteOneTrade = async (req, res) => {
  // extract trade Id of the trade to delete
  const {
    params: { tradeId },
  } = req;
  if (!tradeId) {
    return;
  }
  try {
    await service.deleteOneTrade(tradeId);
    res.status(204).send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getAllTrades,
  getOneTrade,
  createNewTrade,
  updateOneTrade,
  deleteOneTrade,
};
