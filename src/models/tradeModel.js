const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *   schemas:
 *     Trade:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 62d71404566d72ae0ae8f5ae
 *         type:
 *           type: string
 *           enum: [BUY, SELL]
 *         ticker:
 *           type: string
 *           minLength: 1
 *           example: TCS
 *         price:
 *           type: number
 *           minimum: 0
 *           exclusiveMinimum: true
 *           example: 100.0
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 10
 */
module.exports.TradeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    ticker: {
      type: String,
      required: true,
    },
    price: {
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
