const express = require("express");
const controller = require("../controllers/tradeController");
const router = express.Router();

/**
 * @openapi
 * /api/trades:
 *   get:
 *     tags:
 *       - Trade
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Trade"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.get("/", controller.getAllTrades);

/**
 * @openapi
 * /api/trades/{tradeId}:
 *   get:
 *     tags:
 *       - Trade
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the trade to get
 *         example: 62d71404566d72ae0ae8f5ae
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: "#/components/schemas/Trade"
 *       500:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.get("/:tradeId", controller.getOneTrade);

/**
 * @openapi
 * /api/trades:
 *   post:
 *     tags:
 *       - Trade
 *     requestBody:
 *       description: trade data to be saved
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [BUY, SELL]
 *               ticker:
 *                 type: string
 *                 minLength: 1
 *                 example: TCS
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 example: 100.0
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: "#/components/schemas/Trade"
 *       400:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 *       500:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.post("/", controller.createNewTrade);

/**
 * @openapi
 * /api/trades/{tradeId}:
 *   patch:
 *     tags:
 *       - Trade
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the trade to update
 *         example: 62d71404566d72ae0ae8f5ae
 *     requestBody:
 *       description: trade data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             anyOf:
 *               - properties:
 *                   type:
 *                     type: string
 *                     enum: [BUY, SELL]
 *               - properties:
 *                   ticker:
 *                     type: string
 *                     minLength: 1
 *                     example: TCS
 *               - properties:
 *                   price:
 *                     type: number
 *                     minimum: 0
 *                     exclusiveMinimum: true
 *                     example: 100.0
 *               - properties:
 *                   quantity:
 *                     type: integer
 *                     minimum: 1
 *                     example: 10
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: "#/components/schemas/Trade"
 *       400:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 *       500:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.patch("/:tradeId", controller.updateOneTrade);

/**
 * @openapi
 * /api/trades/{tradeId}:
 *   delete:
 *     tags:
 *       - Trade
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the trade to delete
 *         example: 62d71404566d72ae0ae8f5ae
 *     responses:
 *       204:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *       400:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 *       500:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.delete("/:tradeId", controller.deleteOneTrade);

module.exports = router;
