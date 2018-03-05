var express = require('express');
var router = express.Router();
var user = require('../models/users');

var returnObject;
//用户注册接口
router.post('/user/register',function(req,res,next){
  //初始化返回对象
  returnObject = {
    code:-1, 
    message:''
  }
  console.log("有一位新用户注册");
  console.log(req.body);//需要配置body-parser
  if (req.body){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if (!username || !password || !repassword ){  
      returnObject.code = 0;
      returnObject.message = "信息填写不完整";
      res.json(returnObject);
      return;
    }
    if (password != repassword){
      returnObject.code = 1;
      returnObject.message = "两次密码不一致";
      res.json(returnObject);
      return;
    }
    user.findOne({username:username}).then(function(object){
      console.log(object);
      if (!object){
        var userInfo = new user({
          username:username,
          password:password
        });
        return userInfo.save().then(function(userRecord){
          console.log(userRecord);
          returnObject.code = -1;
          returnObject.message = "注册成功"
          res.json(returnObject);
        });
      }else{
        console.log("该用户名已被注册");
        returnObject.code = 2;
        returnObject.message = "该用户名已被注册";
        res.json(returnObject);
        return;
      }
    })
  } 
});

router.post('/user/login',function(req,res,next){
  var returnObject = {
    code:0,
    message:""
  };
  if (req.body){
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password){
      returnObject.code = -1;
      returnObject.message = "未输入用户名或密码";
      res.json(returnObject);
      return; 
    };
    user.findOne({username:username,password:password}).then(function(object){
      if (!object){
        returnObject.code = -1;
        returnObject.message = "用户名或密码错误";
        res.json(returnObject);
        return; 
      }else{
        console.log(object);
        console.log("登录成功")
        returnObject.code = 1;
        returnObject.message = "恭喜您，登录成功";
        returnObject.info = {};
        //防止cookie乱码(escape在ASCII和非ASCII字符间转码)
        //该方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码： * @ - _ + . / 。其他所有的字符都会被转义序列替换
        returnObject.info.username = escape(object.username);
        returnObject.info.password = object.password; 
        returnObject.info.id = object._id;
        var userInfo = JSON.stringify({
          _id:returnObject.info.id,
          _username:returnObject.info.username
        });
        req.cookies.set('userinfo',userInfo);
        returnObject.info.username = object.username;
        res.json(returnObject);
        return;
      }
    });
  }
 
});

router.get('/user/layout',function(req,res,next){
  req.cookies.set('userinfo',null);
  res.json(returnObject);
});
module.exports = router;