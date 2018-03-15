var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Article = require('../models/article');

/* 变量区 */
  //资料数据
  var IndexData = {
    categoryData:{},
    articleData:{},
    pageData:{},
    userData:{},
    typeId:''
  };
/* 变量区 */

router.get('/',function(req,res,next){
  IndexData.typeId = req.query.typeId || '';
  var where = {};
  if (IndexData.typeId !== ""){
    where = {category:IndexData.typeId }
  };
  //获取分类列表
  Category.find().then(function(data1){
    IndexData.categoryData = data1;
    return Article.where(where).count(); 
  }).then(function(num){
    //自定义每页显示数量
    IndexData.pageData.piece = 5;
    //总条数
    IndexData.pageData.totalNum = num;
    //当前页
    IndexData.pageData.page = Number(req.query.page) || 1;
    //总页数
    if (num == 0){
      IndexData.pageData.totalPageNum = 1;
    }else{
    IndexData.pageData.totalPageNum = Math.ceil(IndexData.pageData.totalNum/IndexData.pageData.piece);}
    //调整当前页
    IndexData.pageData.page = Math.max(IndexData.pageData.page ,1);
    IndexData.pageData.page  = Math.min(IndexData.pageData.page, IndexData.pageData.totalPageNum);
    return Article.find({},{content:0}).where(where).limit(IndexData.pageData.piece).skip((IndexData.pageData.page-1)*IndexData.pageData.piece).populate('author').sort({'date':-1});
  }).then(function(data2){
    console.log(data2)  
    IndexData.articleData = data2;
    IndexData.userData = req.userinfo;
    //服务端渲染
    //console.log(IndexData.pageData);
    return  res.render('main/index_index',{
        mainData:IndexData
    });
  });
});
router.get('/view',function(req,res,next){
    
});
module.exports = router;