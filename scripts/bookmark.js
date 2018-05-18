'use strict';

/* global store,api */
//eslint-disbale-next-line no-unused-vars
const bookmarks = (function(){
  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">        
        <p>${message}</p>
        <button id="cancel-error">X</button>
      </section>
    `;
  }

  function generateStars(rating){
    let starString = '';
    for(let i =0; i < 5;i++){
      if(i< rating){
        starString = starString + '<span class="fa fa-star star"></span>';
      }      
      else{
        starString = starString + '<span class="fa fa-star"></span>';
      }
    }
    return starString;
  }

  function generateBookmark(item){
    const rating = item.rating;        
    return item.edit? `<form class="create-bookmark-form" aria-live="assertive">  
    <fieldset>
      <legend>Edit a bookmark:</legend><br>
      <legend>${item.title}</legend>
      <legend>${item.url}</legend>   
      <textarea id="js-description" rows="3" cols="50" data-item-id="${item.id}">${item.desc}</textarea> 
      <legend> Current Rating :</legend> ${generateStars(rating)} <br> 
      <label for="rating">Select A Rating (Default would be 1):</label>      
      ${ratingHTML()}          
      <input type="submit" value="SAVE" class="js-update-save-btn"/>
      <input type="button" value="CANCEL" class="js-update-cancel-btn"/>
    </fieldset>                     
    </form>`:`<form class="create-bookmark-form">
      <div class="article" data-item-id="${item.id}">
        <div class="article-title">${item.title}        
        </div>        
        ${generateStars(rating)}                
      </div>
    </form>`;
  }

  function generateExpandedBookmark(item,index){
    const rating = item.rating;    
    return `<form class="create-bookmark-form">
    <div class="article" data-item-id="${item.id}">
      <div class="article-title">${item.title}
      </div>
      <div>${item.desc}
      </div>
      <div><a href="${item.url}">Visit Link</a>
      </div>
      ${generateStars(rating)}
      <button id="edit-button" class="edit-delete-buttons js-edit-buttons" data-item-index="${index}">
            <span>Edit</span>
        </button>
        <button id="delete-button" class="edit-delete-buttons js-delete-buttons" data-item-index="${index}">
            <span>Delete</span>
      </button>
    </div>
    </form>`;    
  }
  function ratingHTML(){
    return `<label for="rating-5">5</label>
    <input id="rating-5" type="radio" name="rating" value="5" checked>
    <label for="rating-4">4</label>
    <input id="rating-4" type="radio" name="rating" value="4" checked>
    <label for="rating-3">3</label>
    <input id="rating-3" type="radio" name="rating" value="3" checked>
    <label for="rating-2">2</label>
    <input id="rating-2" type="radio" name="rating" value="2" checked>
    <label for="rating-1">1</label>
    <input id="rating-1" type="radio" name="rating" value="1" checked>`;
  }
  function generateBookmarkFormHtml(){
    return store.addBookmark?`
    <form class="form-adding-bookmark">  
      <fieldset>
        <legend>Create a bookmark:</legend>        
        <input id="js-title" type="text" placeholder="TITLE">
        <input id="js-url" type="text" placeholder="URL"><br>        
        <textarea id="js-description" rows="3" cols="50" placeholder="Description"></textarea>        
        ${ratingHTML()}          
        <input type="submit" value="SUBMIT"/>
      </fieldset>                     
    </form>`:''; 
  }

  function generateBookmarkStringForAllBookmarks(){       
    return store.items.map((item,index) => {      
      if(item.expand){
        return generateExpandedBookmark(item,index);
      }else{                
        return generateBookmark(item);
      }
    });    
  }

  function render(){
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }          
    renderBookmarkForm();    
    const bookmarksString = generateBookmarkStringForAllBookmarks();     
    $('.js-bookmarkList').html(bookmarksString);
  }

  function handleAddBookmarkBtn(){
    $('#js-add-btn').on('click', event=>{      
      store.toggleAddBookmark();      
      render();
    });
  }

  function handleSubmitForm(){
    $('.create-bookmark-container').on('submit','.form-adding-bookmark',event=>{
      event.preventDefault();
      const title = $(event.currentTarget).find('#js-title').val();
      const url = $(event.currentTarget).find('#js-url').val();
      const desc = $(event.currentTarget).find('#js-description').val();            
      const rating = $(event.currentTarget).find('input[name="rating"]:checked').val();      
      api.postItem({title,url,desc,rating},bookmark => {
        store.addItems(bookmark);
        store.toggleAddBookmark();
        render();
      },(err) => {        
        store.setError(err);
        render();
      });     
    });
  }

  function renderBookmarkForm(){    
    $('.create-bookmark-container').html(generateBookmarkFormHtml());
  }

  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      render();
    });
  }

  function handleClickOverEvent(){
    $('.js-bookmarkList').on('click','.article', event => {
      const id = $(event.currentTarget).data('item-id');      
      store.toggleExpand(id);
      render();
    });
  }

  function handleBookmarkDelete(){
    $('.js-bookmarkList').on('click','.js-delete-buttons',event =>{
      const index = $(event.currentTarget).data('item-index');            
      api.deleteItem(store.items[index].id,store.deleteItem(index));
      render();
    });
  }

  function handleBookmarkEditBtn(){
    $('.js-bookmarkList').on('click','.js-edit-buttons',event =>{
      event.preventDefault();
      const index = $(event.currentTarget).data('item-index');                 
      store.toggleEdit(index);      
      render();      
    });
  }

  function handleBookmarkUpdate(){
    $('.js-bookmarkList').on('submit','.create-bookmark-form',event =>{      
      event.preventDefault();
      const desc = $(event.currentTarget).find('#js-description').val();            
      const rating = $(event.currentTarget).find('input[name="rating"]:checked').val();
      const id = $(event.currentTarget).find('#js-description').data('item-id');       
      api.patchItem(id,{desc,rating},store.updateItem(id,{desc,rating}));
      render();
    });
  }

  function handleMinimumRatingFilterEvent(){
    $('.js-minimum-rating-filter').on('change', event =>{
      event.preventDefault();
      const value = document.getElementById('mySelect').value;
      store.minimumRatingFilter(value);      
    });
  }
  
  function handleCancelButtonClick(){
    $('.js-bookmarkList').on('click','.js-update-cancel-btn',event =>{ 
      const id = $(event.currentTarget).closest('.create-bookmark-form').find('#js-description').data('item-id');
      let index;
      store.items.forEach(item => {
        if(item.id === id){        
          index = store.items.indexOf(item);
        }
      });      
      store.toggleEdit(index);
      render();      
    });
  }

  function bindEventListners(){       
    handleAddBookmarkBtn();
    handleSubmitForm();
    handleCloseError();
    handleClickOverEvent();
    handleBookmarkDelete();
    handleBookmarkEditBtn();
    handleMinimumRatingFilterEvent();
    handleBookmarkUpdate();
    handleCancelButtonClick();
  }
  return {
    bindEventListners,
    render,    
  };
}());