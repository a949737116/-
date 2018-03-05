

$(function(){
  var loginBox = $("#loginBox");
  var regBox = $("#registerBox");
  var infoBox = $("#userInfo");
  loginBox.find('a').unbind("click").bind("click",function(){
    regBox.show();
    loginBox.hide();
  })
  regBox.find('a').unbind("click").bind("click",function(){
    loginBox.show();
    regBox.hide();
  })
  regBox.find('button').unbind("click").bind("click",function(){
    //ajax请求
    $.ajax({
      type:'post',
      url:'/api/user/register',
      data:{
        username:regBox.find('[name="username"]').val(),
        password:regBox.find('[name="password"]').val(),
        repassword:regBox.find('[name="repassword"]').val()
      },
      dataType:'json',
      success:function(result){
        if (result.code != -1){
          $(".colWarning").html(result.message);
        }else{
          $(".colWarning").html(result.message);
          setTimeout(function(){
            window.location.reload();
          },1000)
        }
      }
    });
  })
  loginBox.find('button').unbind("click").bind("click",function(){
    //ajax请求
    $.ajax({
      type:'post',
      url:'/api/user/login',
      data:{
        username:loginBox.find('[name="username"]').val(),
        password:loginBox.find('[name="password"]').val(),
      },
      dataType:'json',
      success:function(result){
        if (result){
          if (result.code == 1){
            setTimeout(function(){
              window.location.reload();
            },1000)
          }else{
            loginBox.find(".colWarning").html(result.message);
          }
        }
      }
    });
  });
  infoBox.find('#logoutBtn').unbind("click").bind("click",function(){
    $.ajax({
      type:'get',
      url:'/api/user/layout',
      success:function(result){
        if (!result.code){
          setTimeout(function(){
            window.location.reload();
          },1000)
        }
      }
    });
  });
})