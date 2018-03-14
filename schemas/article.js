var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articlesSchema = new Schema({
  //文章名
  title:String,
  //文章内容
  content:{
    type:String,
    default:'这是文章内容'
  },
  //简介
  description:{
    type:String,
    default:'这是文章简介'
  },
  //分类
  category:{
    //关联到categroy表
    type:mongoose.Schema.Types.ObjectId,
    ref:'Categorys'     
  },
  //作者
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  //阅读量
  view:{
    type:Number,
    default:0
  },
  //创作时间
  date:{
    type:Date,
    default:new Date()
  }
});
module.exports = articlesSchema;