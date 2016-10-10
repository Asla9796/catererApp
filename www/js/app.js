// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngStorage', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  
  $httpProvider.defaults.withCredentials = true;
  
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sideMenu.html',
    controller: 'sideMenuCtrl'
  })

  .state('app.menu', {
    url: '/menu',
    views: {
      'menuContent': {
        templateUrl: 'templates/menu.html',
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
        }
      }
    })
    
  .state('app.trialpages', {
      url: '/trialpages',
      views: {
        'menuContent': {
          templateUrl: 'templates/trialpages.html',
        }
      }
    })  
  //   .state('app.playlists', {
  //     url: '/playlists',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/playlists.html',
  //         controller: 'PlaylistsCtrl'
  //       }
  //     }
  //   })

  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // })

  .state('app.tabsOrders', {
      url: '/tabsOrders',
      views: {
        'menuContent': {
          templateUrl: 'templates/tabsOrders.html'
        }
      }
    })

  .state('app.pendingOrders', {
      url: '/tabsOrders/pendingOrders',
      views: {
        'tab-pendingOrders': {
        }
      }
    })

  .state('app.confirmedOrders', {
      url: '/tabsOrders/confirmedOrders',
      views: {
        'tab-confirmedOrders': {
        }
      }
    })
  .state('app.deliveredOrders', {
      url: '/tabsOrders/deliveredOrders',
      views: {
        'tab-deliveredOrders': {
        }
      }
    })
  .state('app.canceledOrders', {
      url: '/canceledOrders',
      views: {
        'menuContent': {
          templateUrl: 'templates/canceledOrders.html'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tabsOrders');
  // $ionicConfigProvider.tabs.position('bottom');
});
