var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    categoryName:String
});
module.exports = categorySchema;