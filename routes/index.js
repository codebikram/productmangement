// #region ALL require file
var express = require("express");
var router = express.Router();
const product = require("../Model/product");
const category = require("../Model/category");
var jwt = require("jsonwebtoken");
var multer = require("multer");
const upload = multer({ dest: "Uploaded files/csv/" });
var csv = require("csvtojson");

//controller require
const categoryController = require('../Controller/categoryController');
const productController = require('../Controller/productController');
const authController = require('../Controller/authController');
//end
//middleware
const isValid = (req, res, next) => {
  var cookie = req.cookies.token;
  // console.log(cookie);
  if (!cookie) {
    res.redirect("/login");
  }
  try {
    const data = jwt.verify(cookie, "mysecret");
    req.user = data.user;
    // console.log(req.user);
    next()
  } catch (error) {
    res.status(401).send({ error: "please authenticate using  valid token" })
  }
}
//end middleware

//home page section
router.get("/", function (req, res) {
  res.render("index", { title: "ProductBoard" });
});
router.get("/employee", function (req, res) {
  res.render("employee", { title: "employee" });
});
//end home page section

//#region product section
router.get("/product", isValid, async function (req, res) {
  var searchFilter = {};
  if (req.query.categoryId) {
    searchFilter.categoryId = req.query.categoryId;
  }
  var productList = await product.find(searchFilter).populate("categoryId");
  var categoryList = await category.find({ user: req.user });
  // console.log("categoryList---->"+categoryList);
  for (var i = 0; i < productList.length; i++) {
    var actualPrice =
      Number(productList[i].price) -
      (Number(productList[i].price) * Number(productList[i].discount)) / 100;
    productList[i].actualPrice = actualPrice;
  }
  for (var i = 0; i < productList.length; i++) {
    var totalAmount = (Number(productList[i].actualPrice) * Number(productList[i].qty));
    productList[i].totalAmount = totalAmount;
  }
  res.render("product", {
    user: req.user,
    title: "Product",
    product: productList,
    categoryList: categoryList,
  });
});
router.post("/product-update", productController.productUpdate);
router.post("/product-delete", productController.productDelete);
router.post("/product-data", productController.productAdd);
//csv upload section
router.post("/create_location_viaCSV", upload.single("products"), (req, res) => {
  var failureArray = [];
  const csvFilePath = req.file.path;
  if (csvFilePath) {
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        var csvjson = jsonObj;
        console.log("csvjson", JSON.stringify(csvjson));
        for (let i = 0, p = Promise.resolve(); i < csvjson.length; i++) {
          p = p.then(
            (_) =>
              new Promise((resolve) => {
                var data = {
                  categoryId: csvjson[i].categoryId,
                  name: csvjson[i].name,
                  qty: Number(csvjson[i].qty),
                  price: csvjson[i].price,
                  discount: csvjson[i].discount,
                };
                var productData = new product(data);
                productData.save(function (err, result) {
                  if (err) {
                    failureArray.push(data);
                    console.log(err);
                    resolve();
                  } else {
                    console.log(result);
                    if (i == csvjson.length - 1) {
                      res.send({
                        success: " CSV file Successfully Inserted",
                        failureArray: failureArray,
                      });
                    }
                    resolve();
                  }
                });
              })
          );
        }
      });
  }
});
// #endregion

// #region category section
router.get("/category", isValid, async function (req, res) {
  try {
    const categoryList = await category.find({ user: req.user });
    res.render("category", {
      user: req.user,
      title: "Category",
      categoryList: categoryList
    });
  } catch (error) {
    res.status(404).send({ error: "Not found" })
  }

});
router.post("/category-data", isValid, categoryController.categoryAdd);
router.post("/category-update", categoryController.categoryUpdate);
router.post("/category-delete", categoryController.categoryDelete);
// #endregion

// #region Auth secton
router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});
router.get("/logout", function (req, res) {
  res.clearCookie("token");
  res.render("login", { title: "Login" });
});
router.get("/signup", function (req, res) {
  res.render("signup", { title: "SignUp" });
});
router.post("/login-data", authController.loginPost);
router.post("/signup-data", authController.signupPost);
// #endregion

module.exports = router;
