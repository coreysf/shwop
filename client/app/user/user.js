angular.module('shwop.user', [])


.controller('UserController', ['$scope', '$window', 'Products', 'Auth', function ($scope, $window, Products, Auth) {
  $scope.categories = Products.categories;
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Calls factory method that returns all product info from DB and renders it.
  $scope.getUserProducts = function () {
    //get the token
    var token = $window.localStorage.getItem('com.shwop');
    console.log('The token is', token);
    Products.getUserProducts(token)
    .then(function (myProducts) {
      console.log('myProducts are', myProducts);
      $scope.data.products = myProducts.data.products;
      console.log($scope.data);
    })
    .catch(function (err) {
        console.log('/api/products/mystore POST failed', err);
    });
  };

  $scope.getUserProducts();
}]);
