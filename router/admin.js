var express = require('express');
var router = express.Router();
var User = require('../models/users');
router.get('/',function(req,res,next){
  if (!req.userinfo.isAdmin){
    res.send("抱歉，您无管理员权限");
  }else{
    //跳转到管理页
    res.render('admin/index',{
      userInfo:req.userinfo
    })
  }
});
var pagesInfo = {
  listNum:5,//每页几行(可调控)
  totalPages:1,//总页
  page:1,//当前页
  totalCount:1,//总数量
  minPage:1
};
router.get('/users',function(req,res,next){
  //计算数据库表中用户数
  User.count().then(function(totalNum){
    console.log("一共有" + totalNum + "条数据");
    pagesInfo.totalCount = totalNum;
    pagesInfo.totalPages = Math.ceil(totalNum/pagesInfo.listNum);
    //页数，已经防止页数超标
    var page = Number(req.query.page) || 1;
    page = Math.max(1,page);
    page = Math.min(page,pagesInfo.totalPages);
    pagesInfo.page = page;
     //数据库导出用户表
     var limitNum = pagesInfo.listNum;
     var skipNum = (pagesInfo.page - 1)*pagesInfo.listNum;
     console.log(pagesInfo);
    User.find().limit(limitNum).skip(skipNum).then(function(result){
      var usersList = result;
      res.render('admin/users',{
        userInfo:req.userinfo,
        users:usersList,
        pageInfo:pagesInfo
      })
    });
  });
})
module.exports = router;