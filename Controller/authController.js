const user = require('../Model/user');
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.loginPost = async (req, res) => {
    if (req.body) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var email = req.body.email;
        var password = req.body.password;
        const isUserExist = await user.findOne({ email: email });
        if (isUserExist) {
            // email match
            bcrypt.compare(
                password,
                isUserExist.password,
                async function (err, result) {
                    // result === true
                    if (result) {
                        //jwt
                        await jwt.sign(
                            {
                                user: isUserExist._id,
                            },
                            "mysecret",
                            { expiresIn: 60 * 60 },
                            (err, token) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.cookie("token", token);
                                    res.send({ success: "login success" });
                                }
                            }
                        );
                    } else {
                        res.send({ error: "Password not match" });
                    }
                }
            );
        } else {
            res.send({ error: "user not found" });
        }
    }
}
exports.signupPost = async (req, res) => {
    if (req.body) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var name = req.body.name;
        var email = req.body.email;
        const isUserExist = await user.findOne({ email: email });
        if (!isUserExist) {
            var password = req.body.password;
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    // Store hash in your password DB.
                    var data = {
                        name: name,
                        email: email,
                        password: hash,
                        status: "N",
                        createdOn: Date.now(),
                        updatedOn: Date.now(),
                    };
                    const createResponse = await user.create(data);
                    if (createResponse) {
                        res.send({ success: "User registered successfully" });
                    } else {
                        res.send({ error: "Something went wrong" });
                    }
                });
            });
        } else {
            res.send({ error: "User already exist" });
        }
    }
}