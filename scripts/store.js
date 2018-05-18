'use strict';
/*global bookmarks */
//eslint-disable-next-line no-unused-vars
const store = (function(){

  let items = [];
  
  let addBookmark = false;
  
  const setError = function(error) {
    this.error = error;
  };

  const addItems =  function(item){     
    item.expand = false;
    item.edit = false;
    this.items.push(item);    
  };

  const toggleAddBookmark = function(){
    this.addBookmark = !this.addBookmark;
  };

  const toggleExpand = function(id){   
    this.items.forEach(item => {
      if(item.id === id){
        item.expand = !item.expand;
      }
    });    
  };

  const toggleEdit = function(index){
    this.items[index].edit = !this.items[index].edit;    
  };

  const deleteItem = function(index){
    this.items.splice(index,1);
  };

  const updateItem = function(id,newItem){
    this.items = this.items.map(item => {      
      if(item.id !== id){
        return item;
      }else{
        item.desc = newItem.desc;
        item.rating = newItem.rating;   
        item.edit = false;        
        return item;
      }   
    });
  };

  const minimumRatingFilter = function(value){       
    let completeItemArr = this.items;
    if(value != 0){
      let temp = this.items.filter(item => {
        if(item.rating >= value){
          return item;
        }
      });          
      this.items = temp;      
    }
    bookmarks.render();
    this.items = completeItemArr;
  };

  return {
    items,
    addBookmark,
    error : null,
    minimumRating:'0',

    addItems,
    toggleAddBookmark,
    setError,
    toggleExpand,
    deleteItem,
    updateItem,
    minimumRatingFilter,
    toggleEdit,
  };
}());
