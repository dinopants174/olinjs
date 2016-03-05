//the below code is client-side javascript for the home page of Twote

var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

//gets the form where the user writes and posts their twote
var $addTwoteForm = $("#addTwoteForm");

//on success, prepend the div so that the currently logged in user's latest tweet always appears on top of twote feed
var onAddTwoteSuccess = function(data, status){
  //the way I structured each twote is that the parent li for each twote div has the author's id and each div has the twote id
  var content = "<li class='twote' id=" + data['authorId'] + "><div id=" + data['id'] + "><p>" + data['text'] + "</p><p>" + data['author'] + 
  "</p><button class='delete' type='button'>Delete Post</button></div></li>"
  $("#twoteFeed").prepend(content);
};

//on submit, we automatically know who the logged in user is by the Welcome, user's name header so we get  the text of the twote and the 
//author and pass that to the server
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

//when you click on an individual user in the user feed, we find all children of the twote feed who have children with the same id, (the li tags)
//and we highlight them if they were not highlighted or we make them normal again if they were highlighted
$("body").on("click", ".user", function(){
  if ($("#twoteFeed").children("#" + $(this).attr("id")).css("background-color") === "rgb(255, 255, 255)"){
    $("#twoteFeed").children("#" + $(this).attr("id")).css("background-color", "yellow");
  } else {
    $("#twoteFeed").children("#" + $(this).attr("id")).css("background-color", "white");
  }
});

//for all the children of the twoteFeed who have id's that match the currently logged in user, we add a button to each div to let the currently
//logged in user delete their own twote
$("#twoteFeed").children("#" + $(".loggedInUser").attr("id")).each(function (index){
  var content = "<button class='delete' type='button'>Delete Post</button>"
  $(this).children().append(content);
});

//when a twote is deleted, we use the twoteId to find the parent li tag and we remove it from the feed
var onDeleteTwoteSuccess = function(data, status){
  // Nice frontend removal, also good job on keeping all logs away from master/prod.
  $("#" + data.twoteId).parent().remove();
};

//when the delete button is clicked, get the twote id from the parent div, and since only the currently logged in user can delete twotes,
//get their id and pass them to server
$("body").on("click", ".delete", function(){
  var twoteId = $(this).parent().attr("id");
  var authorId = $(".loggedInUser").attr("id");
  $.post("postDelete", {
    twoteId: twoteId,
    authorId: authorId
  })
    .done(onDeleteTwoteSuccess)
    .error(onError);
});