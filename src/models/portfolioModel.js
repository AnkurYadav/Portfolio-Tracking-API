const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 62d71404566d72ae0ae8f5ae
 *         ticker:
 *           type: string
 *           minLength: 1
 *           example: TCS
 *         average_buy_price:
 *           type: number
 *           minimum: 0
 *           exclusiveMinimum: true
 *           example: 100.0
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 10
 */
module.exports.PortfolioSchema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
      unique: true,
    },
    average_buy_price: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
