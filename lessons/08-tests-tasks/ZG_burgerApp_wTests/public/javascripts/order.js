var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};


$("body").on("change", ":checkbox", function(){
  //when a checkbox is clicked or unclicked, figure out which checkbox was changed, get the price of that
  //ingredient, and either add or subtract from the running counter
  var currentPrice = parseFloat($("#priceCounter").html());
  if (this.checked){
    var updatedPrice = currentPrice + parseFloat($(this).parent().children("#Price").html())
    $("#priceCounter").html(updatedPrice);
  } else {
    var updatedPrice = currentPrice - parseFloat($(this).parent().children("#Price").html())
    $("#priceCounter").html(updatedPrice);
  }
});

//gets the form for the user to order
var $orderForm = $("#orderForm");

var onOrderSuccess = function(data, status) {
  //when order is successfully added to db, send alert to user
  alert("CONGRATULATIONS! " + data['name'] + "'s order was successfully placed."); 
};

$orderForm.submit(function(event) {
  //when order is submitted, get the name of the user, the price, create an array where each element
  //is a string that contains the id of the ingredients the user checked, and send it to server
  event.preventDefault();

  var name = $orderForm.find("[name='name']").val();
  var price = parseFloat($("#priceCounter").html());
  selectedIngredients = [];
  $("input:checkbox:checked").each(function(){
    selectedIngredients.push($(this).parent().attr("id"))
  });

  $.post("postOrder", {
    name: name,
    order: selectedIngredients,
    price: price
  })
    .done(onOrderSuccess)
    .error(onError);
});