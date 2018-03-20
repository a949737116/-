/*
  comments:[
    {
      date:xxxx,
      contents:xxxx,
      author:xxx
    }
  ]
*/
var me = this;
$(function(){
  me.drawView();
  $("#messageBtn").click(function(e){
    e = e || window.event;
    var contents = $("#messageContent").val();
    console.log(contents);
    var author = $("#contentId").data('author');
    var id = $("#contentId").data('id');
    $.ajax({
      url:'/view/addComments',
      type:'POST',
      data:{
        date:new Date(),
        contents: contents,
        author: author,
        articleId:id
      },
      success:function(data){
        if (data.code === 1){
          me.drawView();
        }
      }
    })
  });
});
function drawView(){
    var id = $("#title").data("id");
    $.ajax({
      url:'/view',
      data:{id:id},
      type:'POST',
      success:function(data){
        console.log(data);
        $("#title").html(data.title);
        $(".info>span").eq(0).html(data.author.username);
        var newDate = me.timeFormat(data.date);
        $(".info>span").eq(1).html(newDate);
        $(".info>span").eq(2).html(data.view);
        $(".info>span").eq(3).html(data.view);
        $(".content").html(data.content);
        $("#messageCount").html(data.comments.length);
        $(".commentsBox").html("");
        // <p class="textLeft mTitle">阴阳师 1999-11-22</p>
        // <p class="textLeft">评论内容</p>
        // <p class="textLeft mTitle">实弹射击 1991-3-22</p>
        // <p class="textLeft">评论内容</p>
        // <p class="textLeft clear">
        for (var i = 0;i<data.comments.length;i++){
          var contents = data.comments[i].contents;
          var date = me.timeFormat(data.comments[i].date);
          var author = data.comments[i].author;
          $(".commentsBox").append('<p class="textLeft mTitle">' + author + " " + date + '</p>');
          $(".commentsBox").append('<p class="textLeft">'+ contents +'</p>');
        }
        $(".commentsBox").append('<p class="textLeft clear">');
      },
    });
};
function timeFormat(orignDate){
  orignDate = new Date(orignDate);
  var month = orignDate.getMonth() + 1;
  var hour = orignDate.getHours();
  var minutes = orignDate.getMinutes();
  var second = orignDate.getSeconds();
  var year = orignDate.getFullYear();
  var day = orignDate.getDate();
  var newDate = year + '年' + month + '月' + day + '日' + " " + hour + ":" + minutes + ":" + second;
  return newDate;
}