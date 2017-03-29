var FakeDatabase = module.exports = {

data: [],

add: function(obj) {
    //adds item to end of array holding data
    FakeDatabase.data.push(obj);
},

getAll: function() {
    //returns copy of array of all items in the database
    return FakeDatabase.data.slice();
},

remove: function(index) {
    //removes item located at index in array and returns it
    return FakeDatabase.data.splice(index,1);
},

sortData: function(){
	//sorts data array by age, doesn't return anything
	FakeDatabase.data.sort(function(a, b){
		return a.age-b.age;
	});
}
/*
I don't mind the db.sortData() function, but I think I would have wrapped it into db.getAll() somehow
instead of requiring a separate fakedatabase call before the db.getAll().
Maybe db.getAll() could take a boolean parameter, and if it's true the data is returned sorted and if
it's false the data is returned in the order the cats were added in?
*/

}
