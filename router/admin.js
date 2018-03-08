var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Category = require('../models/category');
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
});
router.get('/categoryIndex',function(req,res,next){
  Category.count().then(function(num){
    pagesInfo.totalCount = num;
    console.log("一共有" + num + '种分类');
    num === 0 ? pagesInfo.totalPages = 1 : pagesInfo.totalPages = Math.ceil(num/pagesInfo.listNum);
    pagesInfo.page = req.query.page || 1;
    pagesInfo.page = Math.max(pagesInfo.minPage,pagesInfo.page);
    pagesInfo.page = Math.min(pagesInfo.page,pagesInfo.totalPages);
    Category.find().limit(pagesInfo.listNum).skip(pagesInfo.listNum * (pagesInfo.page-1)).then(function(data){
      if (!data){
        res.render('admin/tip',{
          message:"暂无分类，请先手动增加分类",
          code:-1
        });
      }else{
        var categoryList = data;
        res.render('admin/categoryIndex',{
          categoryData:data,
          pageInfo:pagesInfo
        });
      }     
    });
  });
});
router.get('/categoryAdd',function(req,res,next){
  res.render('admin/categoryAdd');
});
router.post('/categoryAdd',function(req,res,next){
  var newCategoryName = req.body.CategoryName || '';
  var message;
  if (newCategoryName == ''){
    message = '请输入新的分类名';
    res.render('admin/tip',{
      message:message,
      code:-1
    });
    return;
  };
  Category.findOne({categoryName:newCategoryName}).then(function(data){
    if (!data){
      var newCategory = new Category({categoryName:newCategoryName});
      return newCategory.save().then(function(uData){
        message='新增分类成功';
        res.render('admin/tip',{
          message:message,
          code:1
        })
      });
    }else{
      message = '该分类名已存在';
      return res.render('admin/tip',{
        message:message,
        code:0
      })
    }
  })
});
router.get('/category/delete',function(req,res,next){
  console.log(req.query);
  res.render('admin/categoryDelete',{id:req.query.cateId,cateName:req.query.cateName})
});
router.post('/category/delete',function(req,res,next){
  console.log(req.body);
  var deletedId = req.body.id;
  var returnObject = {
    code:0
  };
  Category.findOne({_id:deletedId}).then(function(data){
    if (!data){
      returnObject.code = -1;
      res.json(returnObject);
    }else{
      Category.remove({_id:deletedId}).then(function(data){
        console.log("已经删除");
        returnObject.code = 1;
        res.json(returnObject);
      });
    }
  })
});
router.get('/category/change',function(req,res,next){
  console.log(req.query.cateName);
  res.render('admin/categoryChange',{id:req.query.cateId,cateName:req.query.cateName})
});
module.exports = router;