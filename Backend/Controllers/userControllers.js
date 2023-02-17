const User = require("../Models/user");
const Cart = require("../Models/cart");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const objectId = require("mongodb").ObjectId;

// User Signup

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User Already Exist!!" });
  }

  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ message: user });
};

// User Login

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User not found!! You need to Signup!!" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Password!!!" });
  }

  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "35s",
  });
  console.log("Generated Token\n", token);

  if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Successfully LoggedIn", user: existingUser, token });
};

// Verify Token

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  console.log(token);

  if (!token) {
    return res.status(400).json({ message: "No Token Found" });
  }

  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    req.id = user.id;
  });
  next();
};

// Get User

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;

  try {
    user = await User.findById(userId, "-pasword");
  } catch (err) {
    return new Error(err);
  }

  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }
  return res.status(200).json({ message: user });
};

// Refresh Token

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "No Token Found" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication Failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "35s",
    });

    console.log("Regenerated token\n", token);

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    req.id = user.id;
  });
  next();
};

// User Logout

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

//Add To Cart

const addToCart = async (req, res, next) => {
  const { proId, userId } = req.body;
  const total = 0;
  try {
    const proObj = {
      item: proId,
      quantity: 1,
      proStatus: "",
      total: total,
    };

    let userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      let proExist = userCart.products.findIndex(
        (product) => product.item.toString() === proId.toString()
      );

      if (proExist !== -1) {
        await Cart.updateOne(
          { user: userId, "products.item": proId },
          { $inc: { "products.$.quantity": 1 } }
        );
      } else {
        await Cart.updateOne({ user: userId }, { $push: { products: proObj } });
      }
    } else {
      let cartObj = {
        user: userId,
        products: [proObj],
      };

      await Cart.create(cartObj);
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// getting the cart products

const getCartProducts = (req, res, next) => {
  const { userId } = req.body;
  return new Promise(async (resolve, reject) => {
    try {
      const cartItems = await Cart.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $unwind: "$products" },
        {
          $project: {
            item: "$products.item",
            quantity: "$products.quantity",
            proStatus: "$products.proStatus",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "item",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            proStatus: 1,
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] },
          },
        },
      ]);
      resolve(cartItems);
    } catch (error) {
      reject(error);
    }
  });
};

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.addToCart = addToCart;
exports.getCartProducts = getCartProducts;
