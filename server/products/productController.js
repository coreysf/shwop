var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');
var jwt  = require('jwt-simple');

module.exports = {

  // retrieve all the products from the database
  allProducts: function (req, res, next) {
    console.log('all products');
    db.Product.findAll()
    .then(function (products) {
      res.send({products: products});
    })
    .catch(function (error) {
      next(error);
    });
  },

  productsByTags: function (req, res, next) {
    //query to find products by tags
    var tags = req.params.tags.split('+');
    // Category tag will always be inserted at end of tags array
    var categoryTag = tags.pop();
    var categoryProducts;
    console.log(categoryTag);

    // Get all associated products by Category tag
    db.Tag.findOne({where: {tagName: categoryTag}})
    .then(function (tag) {
      return tag.getProducts();
    })
    .then(function (associatedProducts) {
      console.log(associatedProducts);
      categoryProducts = associatedProducts;
      res.send({products: associatedProducts});
    })
    .catch(function (error) {
      next(error);
    });
  },

  // adds a new product to the database
  newProduct: function (req, res, next) {

    var token = req.body.token;
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        if (foundUser) {
          var product = req.body.product;
          var tags = req.body.tags;

          helpers.createProduct(foundUser, product, tags, function (error, result) {
            if (error) {
              next(error);
            }
            res.send(200);
          });
        } else {
          res.send(401,'corrupted token');
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  },

  // update the product
  updateProduct: function (req, res, next) {
    var updates = {};
    if (req.body.name) { updates.name = req.body.name; }
    if (req.body.photoURL) { updates.photoURL = req.body.photoURL; }
    if (req.body.price) { updates.price = req.body.price; }

    db.Product.update(updates, {
      where: { id: req.body.id }
    })
    .then(function () {
      console.log('Successfully updated the product');
      res.send('Update successful');
    })
    .catch(function (error) {
      next(error);
    });
  },

  // delete the product
  deleteProduct: function (req, res, next) {
    db.Product.findOne({ where: { id: req.body.id } })
    .then(function (product) {
      product.destroy();
    })
    .then(function () {
      console.log('Successfully deleted the product');
      res.send(200);
    });
  }

};


