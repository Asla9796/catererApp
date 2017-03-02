var server = "https://data.sqippr.com/api/";
angular.module('starter.controllers', ['ngStorage', 'ionic','starter.services'])

.controller('loginCtrl',function($scope, $location, $http, $ionicPopup, $ionicLoading, $window, currentDetails) {

  var storageTestKey = 'sTest',
  storage = window.sessionStorage;

    if(navigator.onLine) {
      $scope.isOnline = true;
    }
    else{
      $scope.isOnline = false;
    } 
    console.log('hello', $scope.isOnline);


   $scope.showAlert = function(user) {
    // $localStorage.user = user;
    window.localStorage.setItem('user', user);
  
   // An alert dialog
   $scope.showAlert = function(user) {
     $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
     
     var email = user.email;
     var password = user.password;
     var data = { email: email, password: password};
     if (email && password){
  		
      var loginReq = {
       method: 'POST',
       url: 'https://auth.sqippr.com/login',
       data : data
    };
    // console.log(data);
      $http( loginReq).
          then(function(response) {
          // this callback will be called asynchronously
          // when the response is availa 
          // console.log(response);
          
          var i, check = 0;
          for(i=0; i< response.data.hasura_roles.length; i++){
            if(response.data.hasura_roles[i] == 'caterer'){
              check = 1;
            }
          }
          
          if(check === 1){
            window.localStorage.setItem('data', response.data);
            window.localStorage.setItem('token', response.data.auth_token);
            window.localStorage.setItem('currentOutletId', response.data.hasura_id);
            location.replace('home.html');
          }
          else{
                      $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                        title: 'Access denied!',
                        template: 'You are not a valid caterer'
                      });
                    
                      alertPopup.then(function(res) {
                        // console.log('Thank you for not eating my delicious ice cream cone');
                      });
          }
        },
         function(response) {
          // console.log("Error");
          console.log(response);
          var Popup = (response.data.message);
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
           title: 'Error!',
           template: Popup
          });
          
        });	
    }
     else{

        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
       title: 'Error!',
       template: 'Invalid e-mail and password'
    });
     }
   };
  };
  
  // console.log('check');

})

.controller('tabsOrdersCtrl', [ '$scope', '$state', '$http', 'currentDetails', '$window', '$ionicScrollDelegate', 

  function($scope, $state, $http, currentDetails, $window, $ionicScrollDelegate) {
    // console.log(window.localStorage['token']);
    // console.log(window.localStorage['currentOutletId']);
    console.log('called');
    $scope.$on('$ionicView.enter', function() {
      if(navigator.onLine) {
        $scope.isOnline = true;
      }
      else{
        $scope.isOnline = false;
      } 
      console.log($scope.isOnline);
    });
    $scope.scrollToTop = function(){
      console.log('works');
      $ionicScrollDelegate.scrollTop();
    };
    
      var userReq = {
            method: 'POST',
            url: server + '1/table/outlets/select',
            data: {
              'columns': ['*'],
              'where': {'id': parseInt(window.localStorage['currentOutletId'])}
            }
          };
          
        $http(userReq).then(function(response){
          // console.log(response.data);
          window.localStorage.setItem('currentOutlet', response.data);
          currentDetails.addUser(response.data);
          
        },
          function(response){
            console.log(response);
    });
    
     var userAccountReq = {
            method: 'GET',
            url:'https://auth.sqippr.com/user/account/info',
           headers: {
            'Authorization': 'Bearer ' + window.localStorage['token']
          }
     };
        $http(userAccountReq).then(function(response){
          console.log(response.data);
        },
          function(response){
            console.log(response);
    });

}])

.controller('menuCtrl', [ '$scope', '$state', '$window', '$http', '$ionicScrollDelegate', function($scope, $state, $window, $http, $ionicScrollDelegate) {
  // console.log('menuCtrl is working');
  $scope.$on('$ionicView.enter', function() {
    if(navigator.onLine) {
      $scope.isOnline = true;
    }
    else{
      $scope.isOnline = false;
    } 
  }); 
  
    $scope.scrollToTop = function(){
      $ionicScrollDelegate.scrollTop();
    }; 
  console.log($scope.isOnline);
  var menuReq = {
      method: 'POST',
      url: server + '1/table/items/select',
      data: {
        "columns": ["*"],
        "where": {"outletId": parseInt(window.localStorage['currentOutletId'])}
      }
    };
    $http(menuReq).then(function(response){
          window.localStorage.setItem('menuItems', response.data);
          // console.log(response.data);
          var i, j, unsortedMenu = response.data;
          
           $scope.groups = [];
          
              for( i=0; i<unsortedMenu.length; i++) {
                  $scope.groups[i] = {};
                  $scope.groups[i].type = unsortedMenu[i].type;
                  $scope.groups[i].id = i;
              }
          
              for( i=0; $scope.groups[i]!==undefined; i++){
                for( j=0; $scope.groups[j]!=undefined; j++){
                    if(i!==j){
                      if($scope.groups[j].type == $scope.groups[i].type){
                        $scope.groups.splice(j, 1);
                      }
                    }
                }
              }
              for( i=0; $scope.groups[i]!==undefined; i++){
                for( j=0; $scope.groups[j]!=undefined; j++){
                    if(i!==j){
                      if($scope.groups[j].type == $scope.groups[i].type){
                        $scope.groups.splice(j, 1);
                      }
                    }
                }
              }
          
          for( i=0; i<$scope.groups.length; i++){
            $scope.groups[i].items = [];
            for(j=0; j<unsortedMenu.length; j++){
              if( $scope.groups[i].type == unsortedMenu[j].type){
                $scope.groups[i].items.push(unsortedMenu[j]);
              }
            }
          }
       
        },
      function(response){
          console.log(response);
        });
  
  $scope.isAvailable = function(check, item) {
    
         var updateToAvailableReq = {
          method: 'POST',
          url: server + '1/table/items/update',
          data: {
            "$set":{"isAvailable": check},
            "where": {"id": item.id}
          },
          headers: {
            'Authorization': 'Bearer ' + window.localStorage['token'],
            'X-Hasura-Role': 'caterer'
          }
        };
          $http(updateToAvailableReq).then(function(response){
            // console.log(response);
            },function(response){
                console.log(response);
          });
  };
  
   $scope.toggleGroup = function(group) {
    group.show = !group.show;
    };
    $scope.isGroupShown = function(group) {
      return group.show;
    };
  

}])

.controller('settingsCtrl', [ '$scope', '$state', 'currentDetails', '$window', '$http', '$ionicPopup', 'settings', 

  function($scope, $state, currentDetails, $window, $http, $ionicPopup, settings) {
  $scope.$on('$ionicView.enter', function() {
    if(navigator.onLine) {
      $scope.isOnline = true;
    }
    else{
      $scope.isOnline = false;
    } 
  }); 
  // console.log('check');
  $scope.outlet = currentDetails.getUser();
  
   $scope.trial = function(){
     console.log('playing');
        var sound = new Audio("audio/print_notification.wav");
        sound.play();
   };
  
      var getDeliveryTakeAwayReq = {
        method: 'POST',
        url: server + '1/table/outlets/select',
        data: {
          "columns": ["isDeliveryActive", "isOpen"],
           "where": {"id": parseInt(window.localStorage['currentOutletId'])}
         },
         headers: {
           'Authorization': 'Bearer ' + window.localStorage['token'],
           'X-Hasura-Role': 'caterer'
          }
        };
        
      $http(getDeliveryTakeAwayReq).then(function(response){
        // console.log(response);
         $scope.isDeliveryOpen = response.data[0].isDeliveryActive;
         $scope.isTakeAwayOpen = response.data[0].isOpen;
       },function(response){
           console.log(response);
       });

      var getTagsReq = {
        method: 'POST',
        url: server + '1/table/tags/select',
        data: {
          "columns": ["*"],
           "where": {"outletId": parseInt(window.localStorage['currentOutletId'])}
         },
         headers: {
           'Authorization': 'Bearer ' + window.localStorage['token'],
           'X-Hasura-Role': 'caterer'
          }
        };
        
      $http(getTagsReq).then(function(response){
            console.log(response.data);
            $scope.tags = response.data;
       },function(response){
           console.log(response);
       });

  $scope.deliveryOpen = function() {
    if ($scope.isDeliveryOpen === false) {
      $scope.isDeliveryOpen = true;
    } 
    else     
        $scope.isDeliveryOpen = false;
          
          var changeDeliveryReq = {
              method: 'POST',
              url: server + '1/table/outlets/update',
              data: {
                "$set": {"isDeliveryActive": $scope.isDeliveryOpen },
                "where": {"id": parseInt(window.localStorage['currentOutletId'])}
              },
              headers: {
                'Authorization': 'Bearer ' + window.localStorage['token'],
                'X-Hasura-Role': 'caterer'
                }
              };
              
              $http(changeDeliveryReq).then(function(response){
                  console.log(response);
                },function(response){
                  console.log(response);
              });
  };
  
  
  $scope.changeAvailable = function(check, tag){

          var changeMenuGroupReq = {
              method: 'POST',
              url: server + '1/table/tags/update',
              data: {
                "$set": {"isAvailable": check },
                "where": {
						"$and":[
                        {"outletId": parseInt(window.localStorage['currentOutletId'])},
                        {"name": tag}
                	]
                }                
               },
              headers: {
                'Authorization': 'Bearer ' + window.localStorage['token'],
                'X-Hasura-Role': 'caterer'
                }
             };
              
              $http(changeMenuGroupReq).then(function(response){
                  console.log(response);
                },function(response){
                  console.log(response);
              });
         
          var groupAvailabilityReq = {
              method: 'POST',
              url: server + '1/table/items/update',
              data: {
                "$set": {"isAvailable": check },
                "where": {
                    "$and":[
                        {"outletId": parseInt(window.localStorage['currentOutletId'])},
                        {"tag": tag}
                ]
             }
           },
              headers: {
                'Authorization': 'Bearer ' + window.localStorage['token'],
                'X-Hasura-Role': 'caterer'
                }
           };
              
              $http(groupAvailabilityReq).then(function(response){
                  console.log(response);
                },function(response){
                  console.log(response);
              });
              
  };  
  
  
  $scope.takeAwayOpen = function() {
    if ($scope.isTakeAwayOpen === false) {
      $scope.isTakeAwayOpen = true;
    } else
        $scope.isTakeAwayOpen = false;
      
      var changeTakeAwayReq = {
        method: 'POST',
        url: server + '1/table/outlets/update',
        data: {
          "$set": {"isOpen": $scope.isTakeAwayOpen },
           "where": {"id": parseInt(window.localStorage['currentOutletId'])}
         },
         headers: {
           'Authorization': 'Bearer ' + window.localStorage['token'],
           'X-Hasura-Role': 'caterer'
          }
        };
        
        $http(changeTakeAwayReq).then(function(response){
            console.log(response);
           },function(response){
             console.log(response);
         });
         
        var changeAvailabilityReq = {
          method: 'POST',
          url: server + '1/table/items/update',
          data: {
            "$set": {"isAvailable": $scope.isTakeAwayOpen },
             "where": {"outletId": parseInt(window.localStorage['currentOutletId'])}
           },
           headers: {
             'Authorization': 'Bearer ' + window.localStorage['token'],
             'X-Hasura-Role': 'caterer'
            }
          };
          
          $http(changeAvailabilityReq).then(function(response){
              console.log(response);
            },function(response){
               console.log(response);
           });
  };
  
  
  
  $scope.changePrepTime = function(){
    
    var changePrepTimePopup = $ionicPopup.show({
     templateUrl : 'templates/changePrepTimePopup.html',
     title:'Please enter take-away time :',
     scope: $scope,
     buttons: [
     { text: 'Cancel',
       onTap: function(e) {
       var check = 0;
            // alert($scope.deleteAccount.password);
       return {
         check: check
         };
      }
      },
      {
         text: '<b>OK</b>',
         type: 'button-positive',
         onTap: function(e) {
           var check = 1;
             return {
               check: check
           };
          }
        },
        ]
     });
     
    // console.log(window.localStorage['currentOutletId']);
    changePrepTimePopup.then(function(res){
      if(res.check == 1){
        
        $scope.$evalAsync(function(){
          $scope.minPrepTime = settings.getPrepTime();  
          prepTime = $scope.minPrepTime;
          
          var changePrepTimeReq = {
            method: 'POST',
            url: server + '1/table/outlets/update',
            data: {
              "$set": {"minPrepTime": parseInt(prepTime)},
              "where": {"id": parseInt(window.localStorage['currentOutletId'])}
            },
            headers: {
              'Authorization': 'Bearer ' + window.localStorage['token'],
              'X-Hasura-Role': 'caterer'
            }
          };
          $http(changePrepTimeReq).then(function(response){
            // console.log(response);
            },function(response){
              console.log(response);
          }); 
        });
        
      }
    });
     
  };
  
    var getPrepTimeReq = {
      method: 'POST',
      url: server + '1/table/outlets/select',
      data: {
        "columns": ["minPrepTime"],
        "where": {"id": parseInt(window.localStorage['currentOutletId'])}
      },
      headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
    };
    $http(getPrepTimeReq).then(function(response){
      // console.log(response);
      $scope.minPrepTime = response.data[0].minPrepTime;
      },function(response){
        console.log(response);
    }); 
    
    $scope.changePassword = function(){
      
      var changePasswordPopup = $ionicPopup.show({
       templateUrl : 'templates/changePasswordPopup.html',
       title:'Please enter :',
       scope: $scope,
       buttons: [
       { text: 'Cancel',
         onTap: function(e) {
         var check = 0;
              // alert($scope.deleteAccount.password);
         return {
           check: check
           };
        }
        },
        {
           text: '<b>OK</b>',
           type: 'button-positive',
           onTap: function(e) {
             var check = 1;
               return {
                 check: check
             };
            }
          },
          ]
       });
       
       changePasswordPopup.then(function(res){
         if(res.check == 1){
          var password = settings.getPassword();
          var new_password = settings.getNewPassword();
          console.log(password, new_password);
          
            var changePasswordReq = {
              method: 'POST',
                url: 'https://auth.sqippr.com/user/password/change',
                data: {
                  "password": password,
                  "new_password": new_password
                },
                  headers: {
                    'Authorization': 'Bearer ' + window.localStorage['token']
                }
              };
                          
              $http(changePasswordReq).then(function(response){
                      var alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: 'Password successfully changed'
                      });
                    
                      alertPopup.then(function(res) {
                        // console.log('Thank you for not eating my delicious ice cream cone');
                      });
              }, function(response){
                  console.log(response);
              }); 
          }           

       });

    };
    
}])

.controller('prepTimePopupCtrl', ['$scope', 'settings', '$ionicPopup',
  
  function($scope, settings, $ionicPopup){
    $scope.$watch('prepTime', function(newValues, oldValues, scope) {
      settings.addPrepTime($scope.prepTime);
    });  
}])

.controller('changePasswordPopupCtrl', ['$scope', 'settings',
  
  function($scope, settings){
    $scope.$watchGroup(['password', 'newPassword'], function(newValues, oldValues, scope) {
      
        settings.addPassword($scope.password);
        settings.addNewPassword($scope.newPassword);  
        
    }, true); 
}])


.controller('pendingOrdersCtrl', [ '$scope', '$state', '$window', '$http', '$interval', 'orders', '$timeout', '$ionicPopup', 

  function($scope, $state, $window, $http, $interval, orders, $timeout, $ionicPopup) {

    // if (sessionStorage.getItem("is_reloaded") === null){
    // }
    // if(sessionStorage.getItem("is_reloaded") === 'true'){
    //   location.replace('home.html'); 
    //   sessionStorage.setItem("is_reloaded", 'false');
    // }
  
  var pendingOrdersReq = {
    method: 'POST',
    url: server + '1/table/orders/select',
    data: {
        "columns":[
                "*",
                {
                    "name": "items",
                    "columns": [
                            "*",
                            {
                                "name":"item",
                                "columns": ["*"]
                            }
                        ]
                }
            ],
        "where": {
            "$and":[{
                "status":"pending",
                "outletId": parseInt(window.localStorage['currentOutletId'])
            }]
        }
    },
    headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
  };
  
  var pending = function(){
    $http(pendingOrdersReq).then(function(response){
      var now = new Date();
      var time = now.getTime();
      $scope.$evalAsync(function(){
          var i;
          $scope.pendingOrders = [];
          for(i=0; i<response.data.length; i++){
            var timestamp = new Date(response.data[i].timestamp);
            
            if(response.data[i].items.length!==0 && (time-timestamp.getTime())<120000){
              $scope.pendingOrders.push(response.data[i]);
            }
            
              if(timestamp !== null){
                if((time-timestamp.getTime())>120000 && response.data[i].status !== 'canceled'){
                $scope.cancelOrder(response.data[i], 'failedConfirm');
              }
            }
          }
          
          $scope.pendingNumber = $scope.pendingOrders.length;
      });
      },function(response){
        console.log(response);
    });
  };
  
  $interval(pending, 5000);
  
  $scope.getTime = function(hour, min){
    return orders.timeFormat(hour)+":"+orders.getPadded(min);
  };

  
  $scope.remove = function(itemId, id, billAmount, price, qty, orderId){
    var removeFromOrderReq = {
      method: 'POST',
      url: server + '1/table/orderedItems/delete',
      data: {
        "where": {"id": id}
      },
      headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
    };
    $http(removeFromOrderReq).then(function(response){
      // console.log(response);
      },function(response){
        console.log(response);
    });
                
  var updateMenuReq = {
    method: 'POST',
    url: server + '1/table/items/update',
    data: {
      "$set":{"isAvailable": false},
      "where": {"id": itemId}
      },
    headers: {
      'Authorization': 'Bearer ' + window.localStorage['token'],
      'X-Hasura-Role': 'caterer'
      }
    };
    
    $http(updateMenuReq).then(function(response){
      // console.log(response);
    }, function(response){
      console.log(response);
    });
    
    var newAmount = billAmount-(price*qty);
    var updateBillReq = {
      method: 'POST',
      url: server + '1/table/orders/update',
      data: {
        "$set":{"billAmount": newAmount},
        "where": {"id": orderId}
        },
      headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
        }
      };
      
      $http(updateBillReq).then(function(response){
        // console.log(response);
      }, function(response){
        console.log(response);
      });
  };

      
    $scope.confirmOrder = function(order) {
      
      var delivery_charge = 0, packing_charge = 0, conv_charge = 0;
      var a = -0.05284969268;
      var b = 14.8798659;
      var c = -24.54833302;
      var alpha = 0.45;
      var conv = ((-b + Math.sqrt( b*b - 4*a*(c- order.billAmount)))*(1-alpha)*(1-alpha))/(2*a);
        
      if(order.isParcel === true){
        packing_charge = 0.05*order.billAmount;
      }
      if(order.isDelivery === true){
        delivery_charge = 0.02*order.billAmount;
      }
      if(order.paymentMethod == 'onlinePayment'){
        if(order.billAmount<=2500){
          conv_charge = conv;
        }
        else {
          conv_charge = ((-b + Math.sqrt( b*b - 4*a*(c- 2500)))*(1-alpha)*(1-alpha))/(2*a);
        }
      }
      
    
    var confirmOrderReq = {
      method: 'POST',
      url: server + '1/table/orders/update',
      data: {
        "$set":{
        "status": "confirmed", 
        "packing_charge": parseFloat(packing_charge.toFixed(2)), 
        "delivery_charge": parseFloat(delivery_charge.toFixed(2)), 
        "conv_charge": parseFloat(conv_charge.toFixed(2)),
        "totalAmount": parseFloat(packing_charge.toFixed(2))+parseFloat(delivery_charge.toFixed(2))+parseFloat(conv_charge.toFixed(2))+order.billAmount
        },
        "where": {"id": order.id}
      },
      headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
    };
      $http(confirmOrderReq).then(function(response){
        console.log(response);
        },function(response){
            console.log(response);
      });
      
    };
    
    $scope.cancelOrder = function(order, reason) {
      if(reason == 'failedConfirm'){
        var cancelOrderReq = {
            method: 'POST',
            url: server + '1/table/orders/update',
            data: {
              "$set":{
                "status": "canceled",
                "cancel_reason": reason
              },
              "where": {"id": order.id}
            },
            headers: {
              'Authorization': 'Bearer ' + window.localStorage['token'],
              'X-Hasura-Role': 'caterer'
            }
          };
            $http(cancelOrderReq).then(function(response){
              // console.log(response);
              },function(response){
                  console.log(response);
            });  
      }
      else {
        var cancelPopup = $ionicPopup.show({
         templateUrl : 'templates/cancelPopup.html',
         title:'Cancel Orders :',
         subTitle: 'Please choose reason for cancellation',
         scope: $scope,
         buttons: [
           { text: 'Cancel',
             onTap: function(e) {
               var check = 0;
               return {
                 check: check
               };
             }
           },
           {
             text: '<b>OK</b>',
             type: 'button-assertive',
             onTap: function(e) {
               var check = 1;
               return {
                 check: check
               };
             }
           },
         ]
       });
       
       cancelPopup.then(function(res) {
        if(res.check === 1){
          var choice = orders.getChoice();
          
          var cancelOrderReq = {
            method: 'POST',
            url: server + '1/table/orders/update',
            data: {
              "$set":{
                "status": "canceled",
                "cancel_reason": choice
              },
              "where": {"id": order.id}
            },
            headers: {
              'Authorization': 'Bearer ' + window.localStorage['token'],
              'X-Hasura-Role': 'caterer'
            }
          };
            $http(cancelOrderReq).then(function(response){
              console.log(response);
              },function(response){
                  console.log(response);
            });
        }
       }); 
      }
      
    };
  
}])

.controller('cancelPopupCtrl', ['$scope', 'orders',

  function($scope, orders){
    $scope.$watch('choice', function(newValues, oldValues, scope) {
      orders.addChoice($scope.choice);
      console.log($scope.choice);
    });
    
}])

.controller('confirmedOrdersCtrl', [ '$scope', '$state', '$http', '$window', '$interval', '$ionicPopup', '$document', 'orders', '$timeout', 
  
  function($scope, $state, $http, $window, $interval, $ionicPopup, $document, orders, $timeout) {

  var confirmedOrdersReq = {
    method: 'POST',
    url: server + '1/table/orders/select',
    data: {
        "columns":[
                "*",
                {
                    "name": "items",
                    "columns": [
                            "*",
                            {
                                "name":"item",
                                "columns": ["*"]
                            }
                        ]
                },
                {
                  "name":"user",
                  "columns": ["mobile"]
                }
            ],
        "where": {
            "$and":[{
                "outletId": parseInt(window.localStorage['currentOutletId']),
                "status":"confirmed"        
            }]
        }
    },
    headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
  };
  
  var confirmed = function() {
    $http(confirmedOrdersReq).then(function(response){
        // console.log(response);
      $scope.$evalAsync(function(){
          var i;
          $scope.confirmedOrders = [];
          for(i=0; i<response.data.length; i++){
            if(response.data[i].items.length!==0){
              $scope.confirmedOrders.push(response.data[i]);
            }
          }
          
          $scope.confirmedNumber = $scope.confirmedOrders.length;
          $scope.outletName = '';
          var date = new Date();
          $scope.date = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
          $scope.time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
      });
      },function(response){
        console.log(response);
    });
  };
  
  $interval(confirmed, 5000);
  
  $scope.getTime = function(hour, min){
    return orders.timeFormat(hour)+":"+orders.getPadded(min);
  };  
  
  
  $scope.deliverOrder = function(order) {
    var data = {};
      if(order.paymentMethod == 'cashOnDelivery'){
        data = {
        "$set":{"status": "dispatched"},
        "where": {"id": order.id}
        };
      }
      else {
        data = {
        "$set":{"status": "delivered"},
        "where": {"id": order.id}
        };
      }

    var deliverOrderReq = {
    method: 'POST',
    url: server + '1/table/orders/update',
    data: data,
    headers: {
      'Authorization': 'Bearer ' + window.localStorage['token'],
      'X-Hasura-Role': 'caterer'
    }
  };
    $http(deliverOrderReq).then(function(response){
      // console.log(response);
      },function(response){
          console.log(response);
    });
    
  };
  
    
    $scope.printReceipt = function(divName, order){
      var sound = new Audio("audio/print_notification.wav");
      var print = function(divName, order){
      // if (navigator.appName == "Microsoft Internet Explorer")
        // {
        // var PrintCommand = '<object ID="PrintCommandObject" WIDTH=0 HEIGHT=0CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>';
        // document.body.insertAdjacentHTML('beforeEnd', PrintCommand);
        // PrintCommandObject.ExecWB(6, -1); PrintCommandObject.outerHTML = "";
        // }
        // else {
          var printContents = document.getElementById(divName).innerHTML;
          var originalContents = document.body.innerHTML;
      
          document.body.innerHTML = printContents;
      
          window.print();
      
          document.body.innerHTML = originalContents;
          var updatePrintStatusReq = {
          method: 'POST',
          url: server + '1/table/orders/update',
          data: {
            "$set":{"print_status": true},
            "where": {"id": order.id}
            },
          headers: {
            'Authorization': 'Bearer ' + window.localStorage['token'],
            'X-Hasura-Role': 'caterer'
          }
        };
          $http(updatePrintStatusReq).then(function(response){
              console.log(response);
            },function(response){
                console.log(response);
          });
      };
      
      if(order.isImmediate === true || order.isDelivery === true){
        sound.currentTime = 0;
        sound.play();
        print(divName, order);
        location.replace('home.html');
      }
      else{
        
            var getPrepTimeReq = {
              method: 'POST',
              url: server + '1/table/outlets/select',
              data: {
                "columns": ["minPrepTime"],
                "where": {"id": parseInt(window.localStorage['currentOutletId'])}
              },
              headers: {
                'Authorization': 'Bearer ' + window.localStorage['token'],
                'X-Hasura-Role': 'caterer'
              }
            };
            $http(getPrepTimeReq).then(function(response){
              console.log(response.data[0]);
              var date = new Date(order.takeAway_timestamp);
              var time = date.getTime() - (response.data[0].minPrepTime*60*1000);
              var now = new Date();
              var nowTime  = now.getTime();
              var later = time - nowTime;
              console.log(later);
              if(later < 0){
                  
                  var printPopup = $ionicPopup.show({
                   template : 'You have exceeded the time for printing this receipt. Print now?',
                   title:'Time Exceeded!',
                   scope: $scope,
                   buttons: [
                     { text: 'Cancel',
                       onTap: function(e) {
                         var check = 0;
                        // alert($scope.deleteAccount.password);
                         return {
                           check: check
                         };
                       }
                     },
                     {
                       text: '<b>OK</b>',
                       type: 'button-assertive',
                       onTap: function(e) {
                         var check = 1;
                        // alert($scope.deleteAccount.password);
                         return {
                           check: check
                         };
                       }
                     },
                   ]
                 });
                 
                 printPopup.then(function(res) {
                   if(res.check == 1){
                      sound.currentTime = 0;
                      sound.play();
                      print(divName, order);
                      location.replace('home.html');
                 }
                   
                 });                
              }
              else{
                $timeout(function () {
                    sound.currentTime = 0;
                    sound.play();
                    print(divName, order);
                    location.replace('home.html');

                }, later);                
              }

              },function(response){
                console.log(response);
            });
      }
    };
  

}])

.controller('deliveredOrdersCtrl', [ '$scope', '$state', '$http','$window', '$interval', 'orders', 

  function($scope, $state, $http, $window, $interval, orders) {

  
  var delivered = function() {
  var deliveredOrdersReq = {
    method: 'POST',
    url: server + '1/table/orders/select',
    data: {
        "columns":[
                "*",
                {
                    "name": "items",
                    "columns": [
                            "*",
                            {
                                "name":"item",
                                "columns": ["*"]
                            }
                        ]
                }
            ],
        "where": {
            "$and":[{
                "outletId": parseInt(window.localStorage['currentOutletId']),
                "status":"delivered"        
            }]
        }
    },
    headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
  };
  $http(deliveredOrdersReq).then(function(response){
      // console.log(response);
    $scope.$evalAsync(function(){
        var i;
        $scope.deliveredOrders = [];
        for(i=0; i<response.data.length; i++){
          if(response.data[i].items.length!==0){
            $scope.deliveredOrders.push(response.data[i]);
          }
        }
        
        $scope.deliveredNumber = $scope.deliveredOrders.length;
    });
    },function(response){
      console.log(response);
  });
  };
  
  $interval(delivered, 5000);
  
  $scope.getTime = function(hour, min){
    return orders.timeFormat(hour)+":"+orders.getPadded(min);
  };  
  
  $scope.deliver = function(order){
    var deliverOrderReq = {
      method: 'POST',
      url: server + '1/table/orders/update',
      data: {
        "$set":{
        "status": "delivered"
        },
        "where": {"id": order.id}
      },
      headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
    };
      $http(deliverOrderReq).then(function(response){
        console.log(response);
        },function(response){
            console.log(response);
      });
  };

}])

.controller('canceledOrdersCtrl', [ '$scope', '$state', '$http','$window', '$interval', 'orders', 

  function($scope, $state, $http, $window, $interval, orders) {
  $scope.$on('$ionicView.enter', function() {
    if(navigator.onLine) {
      $scope.isOnline = true;
    }
    else{
      $scope.isOnline = false;
    } 
  }); 
  var canceled = function() {
  var canceledOrdersReq = {
    method: 'POST',
    url: server + '1/table/orders/select',
    data: {
        "columns":[
                "*",
                {
                    "name": "items",
                    "columns": [
                            "*",
                            {
                                "name":"item",
                                "columns": ["*"]
                            }
                        ]
                }
            ],
        "where": {
            "$and":[{
                "outletId": parseInt(window.localStorage['currentOutletId']),
                "status":"canceled"        
            }]
        }
    },
    headers: {
        'Authorization': 'Bearer ' + window.localStorage['token'],
        'X-Hasura-Role': 'caterer'
      }
  };
  $http(canceledOrdersReq).then(function(response){
      // console.log(response);
    $scope.$evalAsync(function(){
        var i;
        $scope.canceledOrders = [];
        for(i=0; i<response.data.length; i++){
          if(response.data[i].items.length!==0){
            $scope.canceledOrders.push(response.data[i]);
          }
        }
        
        $scope.canceledNumber = $scope.canceledOrders.length;
    });
    },function(response){
      console.log(response);
  });
  };
  
  $interval(canceled, 5000);
  
  $scope.getTime = function(hour, min){
    return orders.timeFormat(hour)+":"+orders.getPadded(min);
  };
  

}])

.controller('sideMenuCtrl', function($scope, $ionicModal, $timeout, $http, $location, $window, $ionicPopup) {
  $scope.logout = function() {
    
    var confirmPopup = $ionicPopup.confirm({
          title: 'Logout',
          template: 'Are you sure you want to logout??'
        });
    
    // if(window.localStorage['token'] !== '') {
      
     confirmPopup.then(function(res) {
          if(res) {
            var logoutReq = {
              method: 'GET',
              url: 'https://auth.sqippr.com/user/logout',
              headers: {
                'Authorization': 'Bearer ' + window.localStorage['token']
              }
            };
            $http(logoutReq).then(function(response){
                window.localStorage.setItem('token', '');
                window.localStorage.setItem('currentOutlet', '');
                window.localStorage.setItem('currentOutletId', '');
                location.replace('index.html');
          },
            function(response){
                console.log(response);
              });
          } else {
            // console.log('not logged out');
          }
        });
    };

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
});

