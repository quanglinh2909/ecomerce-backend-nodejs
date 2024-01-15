const _ = require("lodash");
const getInfodata = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

module.exports = {
  getInfodata,
};
