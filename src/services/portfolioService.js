const mongoose = require("mongoose");
const { PortfolioSchema } = require("../models/portfolioModel");

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

/**
 * Get all securities from db and return in formatted json array
 * @returns Array<Security>
 */
const getPortfolio = async () => {
  try {
    let portfolio = await Portfolio.find({});
    return portfolio.map((security) => formatSecurity(security));
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Get total returns of current portfolio
 * @returns number
 */
const getReturns = async () => {
  try {
    let portfolio = await getPortfolio();
    let returns = 0;
    for (let security of portfolio) {
      // assuming current price of security to be 100
      let currentPrice = 100;
      returns +=
        (currentPrice - security.average_buy_price) * security.quantity;
    }
    return returns;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Update security data based on trade data
 * @param {Trade} trade - Trade using which security is to be updated
 * @returns void
 */
const updateSecuritiesForTrade = async (trade) => {
  try {
    let security = await module.exports.getSecurity(trade.ticker);
    if (security) {
      if (trade.type === "BUY") {
        // if trade is BUY update security quantity and average price
        let newAvgPrice = getNewAvgPrice(
          security.average_buy_price,
          security.quantity,
          trade.price,
          trade.quantity
        );
        let newQuantity = security.quantity + trade.quantity;
        await updateSecurity(security.ticker, {
          average_buy_price: newAvgPrice,
          quantity: newQuantity,
        });
      } else if (trade.type === "SELL") {
        // if trade is SELL check if that much security quantity available or not
        if (security.quantity > trade.quantity) {
          // update security quantity after sell
          let newQuantity = security.quantity - trade.quantity;
          await updateSecurity(security.ticker, { quantity: newQuantity });
        } else if (security.quantity === trade.quantity) {
          await deleteSecurity(security.ticker);
        } else {
          throw {
            status: 400,
            message: `Trade quantity is more than available quantity.'`,
          };
        }
      }
    } else {
      // if security is not present add new if BUY else throw exception if SELL
      if (trade.type === "BUY") {
        await addNewSecurity({
          ticker: trade.ticker,
          average_buy_price: trade.price,
          quantity: trade.quantity,
        });
      } else if (trade.type === "SELL") {
        throw {
          status: 400,
          message: `Trade quantity is more than available quantity.'`,
        };
      }
    }
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Revert security data based on trade data
 * @param {Trade} trade - Trade for which security change is to be reverted
 * @returns void
 */
const revertTradeforSecurity = async (trade) => {
  // just invert trade type and update security data acc to that
  let revertedTrade = {
    type: trade.type,
    ticker: trade.ticker,
    price: trade.price,
    quantity: trade.quantity,
  };
  if (trade.type === "BUY") revertedTrade.type = "SELL";
  else if (trade.type === "SELL") revertedTrade.type = "BUY";
  return await updateSecuritiesForTrade(revertedTrade);
};

/**
 * Get security data from database
 * @param {string} ticker - Ticker symbol for security to get
 * @returns Security
 */
const getSecurity = async (ticker) => {
  try {
    let security = await Portfolio.findOne({ ticker });
    return security;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Add new security data to database
 * @param {Security} security - security data to add
 * @returns security
 */
const addNewSecurity = async (security) => {
  try {
    let newSecurity = new Portfolio(security);
    let savedSecurity = await newSecurity.save();

    return savedSecurity;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Update security data in database
 * @param {string} ticker - Ticker symbol for security to update
 * @param {Security} changes - security data patch to update
 * @returns security
 */
const updateSecurity = async (ticker, changes) => {
  try {
    let updatedSecurity = await Portfolio.findOneAndUpdate(
      { ticker },
      changes,
      { new: true, useFindAndModify: false }
    );
    return updatedSecurity;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Delete security data from database
 * @param {string} ticker - Ticker symbol for security to delete
 * @returns Security
 */
const deleteSecurity = async (ticker) => {
  try {
    let deletedSecurity = await Portfolio.deleteOne({ ticker });
    return deletedSecurity;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

/**
 * Get new average price
 * @param {number} oldAvgPrice - existing average price of security
 * @param {number} oldQuantity - existing quantity of security
 * @param {number} buyPrice - new buy price of security
 * @param {number} buyQuantity - new buy quantity of security
 * @returns number
 */
const getNewAvgPrice = (oldAvgPrice, oldQuantity, buyPrice, buyQuantity) => {
  return (
    (oldAvgPrice * oldQuantity + buyPrice * buyQuantity) /
    (oldQuantity + buyQuantity)
  );
};

/**
 * Get formatted security data from raw DB security data
 * @param {Security} dbSecurity - raw DB security data
 * @returns Security
 */
const formatSecurity = (dbSecurity) => {
  return {
    _id: dbSecurity._id,
    ticker: dbSecurity.ticker,
    average_buy_price: +dbSecurity.average_buy_price.toString(),
    quantity: dbSecurity.quantity,
  };
};

module.exports = {
  getPortfolio,
  getReturns,
  updateSecuritiesForTrade,
  revertTradeforSecurity,
  getSecurity,
};
