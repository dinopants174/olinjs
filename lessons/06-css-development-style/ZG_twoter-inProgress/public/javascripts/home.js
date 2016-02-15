var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

//the below code is client-side javascript for the ingredients page

//gets the form for the user to add ingredients
var $addTwoteForm = $("#addTwoteForm");

var onAddTwoteSuccess = function(data, status){
  var content = "<li><div id=" + data['_id'] + "><p>" + data['text'] + "</p><p>" + data['author'] + "</p></div></li>"
  $("#twoteFeed").prepend(content);
};

$addTwoteForm.submit(function(event){
  event.preventDefault();
  var twoteText = $addTwoteForm.find("[name='twoteText']").val();
  var authorId = $(".loggedInUser").attr("id");
  $.post("postTwote", {
      text: twoteText,
      author: authorId
  })
    .done(onAddTwoteSuccess)
    .error(onError);
});
