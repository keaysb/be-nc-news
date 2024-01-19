const { fetchApi } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  fetchApi().then((obj) => {
    res.status(200).send({ endpoints_available: obj });
  });
};
