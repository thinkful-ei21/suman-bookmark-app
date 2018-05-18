'use strict';

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/suman'; 
  
  const getItems = function(callback){
    $.getJSON(`${BASE_URL}/bookmarks`,callback);
  };

  const postItem = function(newBookmark,callback,onError){    
    const newBookmarkStringified = JSON.stringify(newBookmark);    
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      data: newBookmarkStringified,
      contentType: 'application/json',
      success: callback,
      error : onError,
    });
  };

  const patchItem = function(id,updatingBookmark,callback){
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'POST',
      data: JSON.stringify(updatingBookmark),
      contentType: 'application/json',
      success: callback,
    });
  };

  const deleteItem = function(id,callback){
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',    
      success: callback,
    });
  };


  return {
    getItems,
    postItem,
    patchItem,
    deleteItem,
  };
}());