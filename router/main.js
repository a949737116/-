var express = require('express');
var router = express.Router();
router.get('/',function(req,res,next){
  //res.send("首页")
  res.render('main/index',{
    userInfo:req.userinfo
  });
});
module.exports = router;