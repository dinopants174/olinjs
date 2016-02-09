var onError = function(data, status) {
  console.log("status", status);
  console.log("error", data);
};

//the below code is client-side javascript for the ingredients page

//gets the form for the user to add ingredients
var $ingredientForm = $("#addIngredientForm");

var onAddIngredientSuccess = function(data, status) {
  //once successfully added to the db on server, client renders the new ingredient on the ingredients page
  var content = "<div id=" + data['_id'] + "><h1 id='name'>Ingredient: " + data['name'] + "</h1>"+
  "<h1 id='price'>Price: " + data['price'] + "</h1>"+
  "<button class='outOfStock' type='button'>Out of Stock</button> " +
  "<button class='Edit' type='button'>Edit</button></div>"
  $("body").append(content);
};

$ingredientForm.submit(function(event) {
  //gets the values from the form and sends a post request to the server with the data for the new ingredients
  event.preventDefault();

  var name = $ingredientForm.find("[name='name']").val();
  var price = $ingredientForm.find("[name='price']").val();

  $.post("postIngredient", {
    name: name,
    price: price
  })
    .done(onAddIngredientSuccess)
    .error(onError);
});

//runs when the user clicks the out of stock button for an ingredient
$("body").on("click", ".outOfStock", function(){  //had to use .on() method for dynamically added ingredients
   var isDisabled = !($(this).html() === 'Out of Stock');  //I really want to know a better way of doing this than looking at 
   //the raw html but I looked into adding my own attributes by modifying the doctype html and I found this one easier
  if (isDisabled){  //if the ingredient was already disabled and they click the button, enable the ingredient
    $(this).html("Out of Stock");
    $(this).parent().css("color", "black");
  } else {  //if the ingredient is not disabled and they click the button, disable the ingredient
    $(this).html("In Stock");
    $(this).parent().css("color", "red");
  }

  $.post("postStock", { //sends a post request to the server with the isDisabled boolean to determine what to set, and the id
    isDisabled: isDisabled,
    ingredientId: $(this).parent().attr("id")
  })
    .done() //do nothing on client side when done, could have also had the css changes happen in on success. don't know which is best practice
    .error(onError);
});


var onEditIngredientSuccess = function(data, status){
  //once successfully modified ingredient in db, render the new name and price of the ingredient
  $("#" + data['_id']).children("#name").html("Ingredient: " + data['name']);
  $("#" + data['_id']).children("#price").html("Price: " + data['price']);
};


$("body").on("click", ".Edit", function(){
  //when the edit button is clicked for each ingredient, get the new name and price of the ingredient, get the id of the ingredient
  //to change and send it to server
  var newName = window.prompt("Please enter the new ingredient name: ", $(this).siblings("#name").html().slice(12));
  if (newName !== ""){
    var newPrice = window.prompt("Please enter the new price for " + newName, $(this).siblings("#price").html().slice(7));
    if (newPrice !== ""){}
      var ingredientId = $(this).parent().attr("id");
      $.post("postEdit", {
        newName: newName,
        newPrice: newPrice,
        ingredientId: ingredientId
      })
        .done(onEditIngredientSuccess)
        .error(onError);
    }
  }
});


