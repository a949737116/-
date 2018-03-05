var mongoose = require('mongoose');
var Schema = mongoose.Schema;//数据库表对象
//用户的表结构
var blogSchema = new Schema({
    //用户名：
    username: String,
    //密码
    password: String,
    //是否管理员
    isAdmin: {
        type: Boolean,
        default: false
    }
})
module.exports = blogSchema;