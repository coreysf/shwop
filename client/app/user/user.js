angular.module('shwop.user', [])


.controller('UserController', ['$scope', '$window', 'Products', 'Users', 'Auth', function ($scope, $window, Products, Users, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Calls factory method that returns all product info from DB and renders it.
  $scope.getUserProducts = function () {
    //get the token
    var token = $window.localStorage.getItem('com.shwop');
    Products.getUserProducts(token)
    .then(function (myProducts) {
      $scope.data.products = myProducts.data.products;
    })
    .catch(function (err) {
        console.log('/api/products/mystore POST failed', err);
    });
  };

// Calls factory mehtod that returns the user's information
  $scope.getUserInfo = function () {
    //get the token
    var token = $window.localStorage.getItem('com.shwop');
    console.log('token is', token);
    Users.getUserInfo(token)
    .then(function (user) {
      console.log('user is ', user);
      $scope.data.user = user.data.userInfo;
      console.log('$scope.data.user is', $scope.data.user);
    })
    .catch(function (err) {
        console.log('/api/users/profile POST failed', err);
    });
  };

  $scope.getUserProducts();
  $scope.getUserInfo();
}]);
