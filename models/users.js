var mongoose = require('mongoose');
var userSchema = require('../schemas/users');
//导入表结构构建模型
module.exports = mongoose.model('Users',userSchema);
//新增数据
/*
  var user1 = new Users({name: 'a'});
  user1.save(function(e){
    if (e){console.log(e)}
  })
*/