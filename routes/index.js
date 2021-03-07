var express = require("express");
var router = express.Router();
const product = require("./Model/product");
const user = require("./Model/user");
var bcrypt = require("bcryptjs");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "STEP TO SOFT" });
});
router.get("/employee", function (req, res, next) {
  res.render("employee", { title: "employee" });
});
// #region product section
router.get("/product", async function (req, res, next) {
  var productList = await product.find({});
  for (var i = 0; i < productList.length; i++) {
    var actualPrice =
      Number(productList[i].price) -
      (Number(productList[i].price) * Number(productList[i].discount)) / 100;
    productList[i].actualPrice = actualPrice;
  }
  res.render("product", { title: "product", product: productList });
});
router.post("/product-update", async function (req, res, next) {
  var updateData = req.body;
  if (updateData) {
    updateData = JSON.parse(JSON.stringify(updateData));
    var data = {
      name: updateData.name,
      qty: updateData.qty ? Number(updateData.qty) : 0,
      price: updateData.price ? Number(updateData.price) : 0,
      discount: updateData.discount ? Number(updateData.discount) : 0,
    };
    const updateProduct = await product.update(
      { _id: updateData.id },
      { $set: data }
    );
    if (updateProduct) {
      res.send({ success: "Product Updated successfully" });
    } else {
      res.send({ error: "Something went wrong" });
    }
  }
});
router.post("/product-delete", async function (req, res, next) {
  var id = req.body.id;
  if (id) {
    const deleteResponse = await product.remove({ _id: id });
    res.send({ success: "Product deleted successfully" });
  } else {
    res.send({ error: "Id is required" });
  }
});
router.post("/product-data", async function (req, res, next) {
  var productData = req.body;
  if (productData) {
    productData = JSON.parse(JSON.stringify(productData));
    var data = {
      name: productData.name,
      qty: productData.qty ? Number(productData.qty) : 0,
      price: productData.price ? Number(productData.price) : 0,
      discount: productData.discount ? Number(productData.discount) : 0,
    };
    const createProduct = await product.create(data);
    if (createProduct) {
      res.send({ success: "Product added successfully" });
    } else {
      res.send({ error: "Something went wrong" });
    }
  }
});
// #endregion

// #region Auth secton
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});
router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "signup" });
});
router.post("/login-data", async function (req, res, next) {
  if (req.body) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var email = req.body.email;
    var password = req.body.password;
    const isUserExist = await user.findOne({ email: email });
    if (isUserExist) {
      // email match
      bcrypt.compare(password, isUserExist.password, function (err, result) {
        // result === true
        if (result) {
          res.send({ success: "login success" });
        } else {
          res.send({ error: "Password not match" });
        }
      });
    } else {
      res.send({ error: "user not found" });
    }
  }
});
router.post("/signup-data", async function (req, res, next) {
  if (req.body) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var email = req.body.email;
    const isUserExist = await user.findOne({ email: email });
    if (!isUserExist) {
      var password = req.body.password;
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          // Store hash in your password DB.
          var data = {
            email: email,
            password: hash,
            status: "N",
            createdOn: Date.now(),
            updatedOn: Date.now(),
          };
          const createResponse = await user.create(data);
          if (createResponse) {
            res.send({ success: "user registered successfully" });
          } else {
            res.send({ error: "something went wrong" });
          }
        });
      });
    } else {
      res.send({ error: "user already exist" });
    }
  }
});
// #endregion

module.exports = router;
