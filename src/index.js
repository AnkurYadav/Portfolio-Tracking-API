const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const tradeRouter = require("./routes/tradeRoutes");
const portfolioRouter = require("./routes/portfolioRoutes");

const { swaggerDocs } = require("./swagger");

// initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/portfoliodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// add middleware
app.use(bodyParser.json());

// add routes
app.use("/api/trades", tradeRouter);
app.use("/api/portfolio", portfolioRouter);

// start up server
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  swaggerDocs(app, PORT);
});
