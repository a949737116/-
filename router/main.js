var express = require('express');
var router = express.Router();
var Category = require('../models/category');
router.get('/',function(req,res,next){
  //获取分类列表
  Category.find().then(function(data){
    console.log(data);
     //res.send("首页")
    res.render('main/index',{
      userInfo:req.userinfo,
      categoryList:data
    });
  });
});
module.exports = router;