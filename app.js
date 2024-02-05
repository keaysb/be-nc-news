const cors = require('cors');

const express = require("express");
const app = express();
app.use(express.json());

app.use(cors());

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./error-handlers/index");

const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
