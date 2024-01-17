const _ = require('lodash');
const getInfodata = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
};
//[a,b] => {a:1,b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 1]));
};

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 0]));
};

module.exports = {
    getInfodata,
    getSelectData,
    unGetSelectData
};
