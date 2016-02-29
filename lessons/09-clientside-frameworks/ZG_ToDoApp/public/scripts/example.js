var ContentEditable = React.createClass({
    //this class was copied from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
    //makes each item on the to-do list clickable to edit the text of the item within a text box, and on clicking out of
    //the text box saves the changes to the virtual dom's state
    render: function(){
        return <div 
            onInput={this.emitChange} 
            onBlur={this.emitChange}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    },
    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    },
    emitChange: function(){
      //onChange is a function that is passed down from the ToDoBox class which is the root of the virtual dom, it will save
      //the new html for the item
        var html = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange(html);
        }
        this.lastHtml = html;
    }
});

var ToDoItem = React.createClass({
  //class used for each item, the item is rendered differently depending on whether or not the item is completed in the to-do
  //list and is made editable using ContentEditable class. onEdit method is used to pass the new html up to the ToDoBox class
  //with the id of the item to change
  onEdit: function(newText){
    this.props.onItemEdit(this.props.id, newText);
  },
  render: function(){
    if (this.props.state === "notCompleted"){
      var divStyle = {color: 'black'};
    } else {
      var divStyle = {color: 'grey', textDecoration: 'line-through'};
    }
    return (
      <div className={this.props.state} style={divStyle}>
      <ContentEditable html={this.props.itemText} id={this.props.id} onChange={this.onEdit}/>
      <DeleteBtn id={this.props.id} onItemRemove={this.props.onItemRemove}/>
      <CompletedBtn id={this.props.id} onItemCompleted={this.props.onItemCompleted}/>
      </div>
    );
  }
});

var CompletedBtn = React.createClass({
  //class used to mark an item as completed. Button that is used in the ToDoItem class and on click, calls the onCompleted
  //method which changes the state of the item in the ToDoBox root class
  onCompleted: function(){
    this.props.onItemCompleted(this.props.id);
  },
  render: function(){
    return (
      <button type="button" className="CompletedBtn" onClick={this.onCompleted}>Finished!</button>
    );
  }
});

var DeleteBtn = React.createClass({
  //class used to delete an item. Button that is used in the ToDoItem class and on click, calls the onRemove method which
  //changes the state to remove the item from the ToDoBox class
  onRemove: function(){
    this.props.onItemRemove(this.props.id);
  },
  render: function(){
    return (
      <button type="button" className="DeleteBtn" onClick={this.onRemove}>Delete</button>
    );
  }
}); 

var ToDoList = React.createClass({
  //parent class to ToDoItem which maps all of the items given to the list from the ToDoBox clas to ToDoItems
  render: function() {
    var listItems = this.props.data.map(function(toDoItem){
      return (
        <ToDoItem state={toDoItem.state} 
         itemText={toDoItem.itemText} 
         key={toDoItem.key} id={toDoItem.id} 
         onItemRemove={this.props.onItemRemove}
         onItemCompleted={this.props.onItemCompleted}
         onItemEdit={this.props.onItemEdit}/>
        );
      }, this);
    return (
      <div className = "ToDoList">
        {listItems}
      </div>
    );
  }
});

var PostItemForm = React.createClass({
  //class used for user to add an item to the to-do list. Uses a single text input to determine the itemText. As
  //the user types, handleItemTextChange changes the state of the virtual dom to match the user input. On submit,
  //empty out the itemText input field and pass the text to the ToDoBox class to add to the state
  getInitialState: function() {
    return {itemText: ''};
  },
  handleItemTextChange: function(e){
    this.setState({itemText: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var itemText = this.state.itemText.trim();
    if (!itemText){
      return;
    }
    this.props.onItemSubmit({itemText: itemText});
    this.setState({itemText: ''});
  },
  render: function() {
    return (
      <form className="PostItemForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="What do you have to do?"
          value={this.state.itemText}
          onChange={this.handleItemTextChange}/>
        <input type="submit" value="Add"/>
      </form>
    );
  }
});


var ListFilter = React.createClass({
  //class used to filter all of the items in the state to only the desired items as specified by the button. I created 3
  //different onClick handlers and I think there is definitely a better way to do this but I didn't know how to bind a single
  //function to each of the buttons so that I know which button was clicked within the function. The filter functions pass a 
  //specific parameter to the parent ToDoBox class to indicate which filter should be applied
  filterAll: function() {
    this.props.handleFilter(0);
  },
  filterActive: function(){
    this.props.handleFilter(1);
  },
  filterCompleted: function(){
    this.props.handleFilter(2);
  },
  render: function() {
    return (
      <div className="listFilter">
            <button type="button" className="allFilter" onClick={this.filterAll}>All</button>
            <button type="button" className="activeFilter" onClick={this.filterActive}>Active</button>
            <button type="button" className="completedFilter" onClick={this.filterCompleted}>Completed</button>
      </div> 
    );
  }
});

var ToDoBox = React.createClass({
  //ToDoBox is the root class of the virtual dom, methods of this class are passed via props to the children. State is set
  //in this class almost all except for handling input change in the form
  handleFilter: function(filterState){
    //filterState is determined in the ListFilter class, 0 is when the button to display all items is clicked, 1 for when only
    //active items are displayed, and 2 for only completed items, I had to use filteredData to display the data as a result of
    //the filtering without losing all of the data if I didn't separate filteredData from all of the data. Would like ideas for
    //improvements
    if (filterState === 0){
      var allItems = this.state.data;
      this.setState({filteredData: allItems});
    } else if (filterState === 1){
      var allItems = this.state.data;
      var filteredItems = allItems.filter(function(item){
        return item.state === 'notCompleted';
      });
      this.setState({filteredData: filteredItems})
    } else if (filterState === 2){
      console.log("I am showing only completed items");
      var allItems = this.state.data;
      var filteredItems = allItems.filter(function(item){
        return item.state === 'completed';
      });
      this.setState({filteredData: filteredItems});
    }
  },
  handleItemEdit: function(id, newText){
    //finds the item to edit and sets the itemText to be the newText from the ContentEditable class, we set the state of all of
    //items using data and reset the filters by setting filteredData to all of the items. I did this because I decided to be
    //consistent in that all actions on the items revert any filtering. For the edit action, I knew how to maintain filtering
    //but later on, I did not
    var items = this.state.data;
    for (var i=0; i < items.length; i++){
      if (items[i].id === id){
        items[i].itemText = newText;
      }
    }
    this.setState({data: items, filteredData: items});
  },
  handleItemCompleted: function(id){
    //finds the item to mark completed and changes its state from notCompleted to completed. Ensures that count will not go
    //below 0 as items are marked completed, again reverts all filters so filteredData goes back to displaying all items 
    var items = this.state.data;
    for (var i=0; i < items.length; i++){
      if (items[i].id === id){
        items[i].state = "completed";
      }
    }
    if (this.state.count-1 < 0){  //ensures that the count of items to be completed doesn't drop below 0
      this.setState({data: items, filteredData: items, count: 0});
    } else {
      this.setState({data: items, filteredData: items, count: this.state.count-1});
    }
  },
  handleItemRemove: function(id){
    //filters the item to remove so that the resulting array only contains items without the removed item's id, ensures count
    //does not drop below 0, again resets filters by setting filteredData: items
    var items = this.state.data;
    items = items.filter(function(item){
      return item.id !== id;
    });
    if (this.state.count-1 < 0){
      this.setState({data: items, filteredData: items, count: 0});
    } else {
      this.setState({data: items, filteredData: items, count: this.state.count-1});
    }
  },
  handleItemSubmit: function(item){
    //adds the created item to the array of all items and sets that to data. Here is where I had a problem with resetting the filter
    //because I can add items to data but I would have to repeat and add items to filteredData to reflect the added item and I really
    //am unsure of how I would accomplish this. If I had a back-end, I would not have this problem because I can filter what the server
    //will return without changing all of the data, which I did not know how to do here
    var items = this.state.data;
    item.state = "notCompleted";
    item.key = Date.now();
    item.id = Date.now(); //used to be unique to each item, I cannot access key which is only used for mapping so I assign the same value for key to id
    item.onItemRemove = this.handleItemRemove;
    var newItems = items.concat([item]);
    var newCount = this.state.count + 1;
    this.setState({data: newItems, filteredData: newItems, count: newCount});
  },
  getInitialState: function(){
    return {filteredData: [], data: [],count: 0};
  },
  render: function(){
    return (
      <div className="ToDoBox">
        <h1>Welcome to your To-Do List</h1>
        <ListFilter handleFilter={this.handleFilter}/>
        <p>The number of items you need to complete is: {this.state.count}</p>
        <ToDoList onItemRemove={this.handleItemRemove} onItemCompleted={this.handleItemCompleted} onItemEdit={this.handleItemEdit} data={this.state.filteredData}/>
        <PostItemForm onItemSubmit={this.handleItemSubmit}/>
      </div>
    );
  }
});

ReactDOM.render(
  <ToDoBox/>,
  document.getElementById('content')
);
