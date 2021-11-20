const product = require('../Model/product');

exports.productAdd = async (req, res) => {
    var productData = req.body;
    if (productData) {
        productData = JSON.parse(JSON.stringify(productData));
        var data = {
            name: productData.name,
            qty: productData.qty ? Number(productData.qty) : 0,
            price: productData.price ? Number(productData.price) : 0,
            discount: productData.discount ? Number(productData.discount) : 0,
            categoryId: productData.categoryId,
        };
        const createProduct = await product.create(data);
        if (createProduct) {
            res.send({ success: "Product added successfully" });
        } else {
            res.send({ error: "Something went wrong" });
        }
    }

}
exports.productUpdate = async (req, res) => {
    var updateData = req.body;
    if (updateData) {
      updateData = JSON.parse(JSON.stringify(updateData));
      var data = {
        name: updateData.name,
        qty: updateData.qty ? Number(updateData.qty) : 0,
        price: updateData.price ? Number(updateData.price) : 0,
        discount: updateData.discount ? Number(updateData.discount) : 0,
      };
      const updateProduct = await product.updateOne(
        { _id: updateData.id },
        { $set: data }
      );
      if (updateProduct) {
        res.send({ success: "Product Updated successfully" });
      } else {
        res.send({ error: "Something went wrong" });
      }
    }  
}
exports.productDelete = async (req, res) => {
    var id = req.body.id;
  if (id) {
    const deleteResponse = await product.deleteOne({ _id: id });
    res.send({ success: "Product deleted successfully" });
  } else {
    res.send({ error: "Id is required" });
  }

}

