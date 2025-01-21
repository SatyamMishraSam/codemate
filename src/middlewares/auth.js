const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  // read the token from req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token, Please Login First");
    }
    const decodedMsg = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedMsg;

    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User doesn't exist");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = { userAuth };
