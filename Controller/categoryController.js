const category = require("../Model/category");


exports.categoryAdd = async (req, res) => {
    var categoryData = req.body;
    if (categoryData) {
        categoryData = JSON.parse(JSON.stringify(categoryData));
        var data = {
            user: req.user,
            name: categoryData.name,
            status: categoryData.status,
        };
        const createResponse = await category.create(data);
        if (createResponse) {
            res.send({ success: "category added successfully" });
        } else {
            res.send({ error: "Something went wrong" });
        }
    }
}
exports.categoryUpdate = async (req, res) => {
    var updateData = req.body;
    if (updateData) {
        updateData = JSON.parse(JSON.stringify(updateData));
        var data = {
            name: updateData.name,
            status: updateData.status,
        };
        const updateCategory = await category.updateOne(
            { _id: updateData.id },
            { $set: data }
        );
        if (updateCategory) {
            res.send({ success: "Category Updated Successfully" });
        } else {
            res.send({ error: "Something went wrong" });
        }
    }
}
exports.categoryDelete = async (req, res) => {
    var id = req.body.id;
    if (id) {
        const deleteResponse = await category.deleteOne({ _id: id });
        res.send({ success: "category deleted successfully" });
    } else {
        res.send({ error: "Id is required" });
    }
}


