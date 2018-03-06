var mongoose = require('mongoose');
var categorySchema = require('../schemas/category');
module.exports = mongoose.model('Categorys',categorySchema);