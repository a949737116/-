//加载区
  var express = require('express');  //express模块
  var swig = require('swig');       //加载模板处理模块
  var mongoose = require('mongoose'); //数据库操作模块
  var bodyParser = require('body-parser');   //用于处理POST提交过来的数据
  var Cookies = require("cookies"); //cookie插件
  var User = require('./models/users');//数据库对象

  //创建一个app应用 => nodejs http.createServer()
  var app = express();
  //配置区
  app.use(function(req,res,next){
    //为每一个请求头都添加cookie
    req.cookies = new Cookies(req,res);
    req.params.userinfo = 1;
    req.userinfo = {};
    if (req.cookies.get("userinfo")){
      try{
        req.userinfo = JSON.parse(req.cookies.get("userinfo"));
        //解码
        req.userinfo._username = unescape(req.userinfo._username);
        User.findById(req.userinfo._id).then(function(data){
          if (data){
            req.userinfo.isAdmin = Boolean(data.isAdmin);
            next();
          }
        })
      }catch(e){
        console.log(e);
        next();
      }
    }else{
      next();
    }
  });

  //配置应用模板
    //定义当前应用所使用的模板引擎
    app.engine('html', swig.renderFile);/*第一个参数是模板引擎的名称，同时也是模板文件的后缀。第二个参数用于处理解析模板内容的方法*/
    app.set('views','./views');/*第一个参数不能变动，第二个为模板存放路径 */
    //注册模板引擎
    app.set('view engine','html');//第一个参数不能改变，第二个参数是app.engine中自定义的引擎名字
    //在开发过程中关闭缓存功能
    swig.setDefaults({cache:false});
  //   app.get('/',function(req,res,next){
  //    //res.send("<h1>欢迎光临我的博客</h1>")
  //    //render读取并解析
  //    //第一个参数表示模板的文件，相当于views目录
  //    //第二个参数表示传递给模板使用的数据
  //    res.render('main/index');
  //  });
   app.get('/main.css',function(req,res,next){
     res.setHeader('content-type','text/css')
     res.send('body{background-color:red}');
   });
   //静态文件托管
      //当用户访问的url以/public开始，那么直接返回对应的_dirname+'/public'
      app.use('/public',express.static(__dirname + '/public'));//在public目录下划分并存放好相关的静态资源文件
   //borderparser设置
   app.use(bodyParser.urlencoded({extended:true,limit:'20000kb'}));
    //模块划分
   app.use('/admin',require('./router/admin'));
   app.use('/api',require('./router/api'));
   app.use('/',require('./router/main'));
   //解决芒果DB Mongoose: mpromise (mongoose's default promise library) is deprecated
   mongoose.Promise = global.Promise;
   //芒果模块的开启
   mongoose.connect("mongodb://localhost:27018/blog",{
     useMongoClient:true
   },function(err){
     if (err){
       console.log("数据库链接失败");
     }else{
       console.log("数据库链接成功");
       //监听http请求
      app.listen(8082);
     }
   });




