const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => Types.ObjectId(id);
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

const removeUndefined = (object = {}) => {
    return _.pickBy(object, _.identity);
};
const updateNestedObjectParser = obj => {
    for (var prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined) {
            delete obj[prop];
        } else if (typeof obj[prop] === 'object') {
            updateNestedObjectParser(obj[prop]);
            // Kiểm tra xem sau khi loại bỏ null, object có trở thành trống hay không
            if (Object.keys(obj[prop]).length === 0) {
                delete obj[prop];
            }
        }
    }
    return obj;
};
module.exports = {
    getInfodata,
    getSelectData,
    unGetSelectData,
    removeUndefined,
    updateNestedObjectParser,
    convertToObjectIdMongodb
};
