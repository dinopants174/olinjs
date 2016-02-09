var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

var onCompletedSuccess = function(data, status) {
  //when the server has successfully changed the isCompleted boolean,
  //remove the div that has the same id as the order that was completed
  $("#" + data['_id']).hide();
};

$("body").on("click", ".isCompleted", function(){
  //get the id of the div for the order that was completed and send it to the server
  $.post("postCompleted", {
    orderId: $(this).parent().attr("id")
  })
    .done(onCompletedSuccess)
    .error(onError);
});