'use strict';
/* global bookmarks, store, api*/

$(document).ready(function() {  
  bookmarks.bindEventListners();
  bookmarks.render();

  api.getItems((bookmarksList) => {
    bookmarksList.forEach(item => store.addItems(item));    
    bookmarks.render();
  });
});




