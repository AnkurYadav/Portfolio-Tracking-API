const mongoose = require("mongoose");
const { TradeSchema } = require("../models/tradeModel");
const portfolioService = require("./portfolioService");

const Trade = mongoose.model("Trade", TradeSchema);

/**
 * Get all trades from db and return in formatted json array
 * @returns Array<Trade>
 */
const getAllTrades = async () => {
  try {
    const allTrades = await Trade.find({});
    return allTrades.map((trade) => formatTrade(trade));
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Get trade data from database
 * @param {string} tradeId - id for trade to get
 * @returns Trade
 */
const getOneTrade = async (tradeId) => {
  try {
    let trade = await Trade.findById(tradeId);
    return formatTrade(trade);
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Add new trade data to database and update security data
 * @param {Trade} trade - trade data to add
 * @returns Trade
 */
const createNewTrade = async (trade) => {
  try {
    if (await isValidTrade(trade)) {
      await portfolioService.updateSecuritiesForTrade(trade);
      let newTrade = new Trade(trade);
      let createdTrade = await newTrade.save();
      return formatTrade(createdTrade);
    }
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Update trde data in database and update security accordingly
 * @param {string} tradeId - Id for trade to update
 * @param {Trade} changes - trade data patch to update
 * @returns Trade
 */
const updateOneTrade = async (tradeId, changes) => {
  try {
    let oldTrade = await getOneTrade(tradeId);
    await portfolioService.revertTradeforSecurity(oldTrade);
    let newTrade = applyChangesToTrade(oldTrade, changes);
    await portfolioService.updateSecuritiesForTrade(newTrade);

    let updatedTrade = await Trade.findOneAndUpdate(
      { _id: tradeId },
      newTrade,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    return formatTrade(updatedTrade);
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Delete trade data from database and revert security changes for that trade
 * @param {string} tradeId - Id for trade to delete
 */
const deleteOneTrade = async (tradeId) => {
  try {
    let trade = await getOneTrade(tradeId);
    await portfolioService.revertTradeforSecurity(trade);
    await Trade.remove({ _id: tradeId });
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Apply only valid patch to trade data
 * @param {Trade} trade - Trade data to apply patch to
 * @param {Trade} changes - trade data patch to apply
 * @returns Trade
 */
const applyChangesToTrade = (trade, changes) => {
  if (changes.type && (changes.type === "BUY" || changes.type === "SELL")) {
    trade.type = changes.type;
  }
  if (changes.ticker) {
    trade.ticker = changes.ticker;
  }
  if (changes.price && changes.price > 0) {
    trade.price = changes.price;
  }
  if (changes.quantity && changes.quantity > 0) {
    trade.quantity = changes.quantity;
  }

  return trade;
};

/**
 * Get formatted trade data from raw DB trade data
 * @param {Trade} dbTrade - raw DB trade data
 * @returns Trade
 */
const formatTrade = (dbTrade) => {
  return {
    _id: dbTrade._id,
    type: dbTrade.type,
    ticker: dbTrade.ticker,
    price: +dbTrade.price.toString(),
    quantity: dbTrade.quantity,
  };
};

/**
 * Check if trade is valid based on trade data and security availability
 * @param {Trade} trade - trade data to check
 * @returns boolean
 */
const isValidTrade = async (trade) => {
  if (
    trade.type &&
    trade.ticker &&
    trade.quantity &&
    trade.price &&
    trade.quantity > 0 &&
    trade.price > 0
  ) {
    if (trade.type === "BUY") {
      return true;
    }
    if (trade.type === "SELL") {
      let security = await portfolioService.getSecurity(trade.ticker);
      if (security && security.quantity >= trade.quantity) {
        return true;
      }
    }
  }
  throw {
    status: 400,
    message: `Trade is not valid.'`,
  };
};

module.exports = {
  getAllTrades,
  getOneTrade,
  createNewTrade,
  updateOneTrade,
  deleteOneTrade,
};
