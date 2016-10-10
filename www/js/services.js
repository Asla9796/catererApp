angular.module('starter.services', [])

.factory('currentDetails', [ function() {
  
  var user = {};
  
  var addUser = function(newUser) {
    user = newUser;
  };
  var getUser = function(){
    return user;
  };

  return {
    getUser: getUser,
    addUser: addUser
  };
  
}])

.factory('orders', [ '$http', function($http) {
  var items = [], orderedItems = [];
  
  var addItems = function(newItems){
    items = newItems;
  };
  var getItems = function(){
    return items;
  };
  
  var addOrderedItems = function(newOrderedItems){
    orderedItems = newOrderedItems;
  };
  var getOrderedItems = function(){
    return orderedItems;
  };
  
  var getPadded = function(val){
    return val < 10 ? ('0' + val) : val;
  };
  
  var timeFormat = function(val){
    return val > 12 ? (val-12) : val;
  };
  
  var  choice = '';
  var addChoice = function(newChoice){
    choice = newChoice;
  };
  var getChoice = function(){
    return choice;
  };
  
  return {
    addItems: addItems,
    getItems: getItems,
    addOrderedItems: addOrderedItems,
    getOrderedItems: getOrderedItems,
    getPadded: getPadded,
    timeFormat: timeFormat,
    addChoice: addChoice,
    getChoice: getChoice
  };
  
}])

.factory('settings', function(){
  
  var prepTime = 0;
  
  var addPrepTime = function(newTime){
    prepTime = newTime;
  };
  
  var getPrepTime = function(){
    return prepTime;
  };
  
  var password = '', new_password = '';
  
  var addPassword = function(newPass){
    password = newPass;
  };
  
  var getPassword = function(){
    return password;
  };
  
  var addNewPassword = function(newRPass){
    new_password = newRPass;
  };
  
  var getNewPassword = function(){
    return new_password;
  };
  
  return {
    addPrepTime: addPrepTime,
    getPrepTime: getPrepTime,
    addPassword: addPassword,
    getPassword: getPassword,
    addNewPassword: addNewPassword,
    getNewPassword: getNewPassword
  };
});