const Category = require("../Models/category");
const Products = require("../Models/product");
const { ObjectId } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const fs = require("fs");
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

//Adding new category

const addcategory = async (req, res, next) => {
  const { category, subcategory } = req.body;
  let categoryExist;

  try {
    categoryExist = await Category.findOne({ name: category });
  } catch (err) {
    return new Error(err);
  }

  if (categoryExist) {
    return res.status(400).json({ message: "Category already exist!!" });
  }

  const newCategory = new Category({ name: category });
  const newSubCategory = { name: subcategory };
  newCategory.subCategories.push(newSubCategory);
  newCategory.save();

  return res.status(201).json({ message: newCategory });
};

//Getting the list of categories

const getCategory = async (req, res, next) => {
  let anyData;
  try {
    anyData = await Category.find();
  } catch (err) {
    console.log(err);
  }

  if (anyData) {
    return res.status(200).json({ message: anyData });
  }

  return res.status(400).json({ message: "No data found!!" });
};

//Adding more subcategories

const addSubCategory = async (req, res, next) => {
  const { category, subcategory } = req.body;

  const newSubCategory = { name: subcategory };

  Category.findOneAndUpdate(
    { name: category },
    { $push: { subCategories: newSubCategory } },
    { new: true }
  )
    .then((updatedCategory) => {
      console.log("New subcategory added:", updatedCategory);
    })
    .catch((err) => {
      console.log(err);
    });
  return res.status(201).json({ message: "Subcategory added successfully" });
};

// Get Sub categories

const getSub = async (req, res, next) => {
  const { category } = req.body;
  let sub = await Category.find(
    { name: category },
    { subCategories: 1, _id: 0 }
  );
  return res.status(201).json({ message: sub });
};

//Adding Products

const addProduct = async (req, res, next) => {
  const file = req.file;
  console.log(file);

  const {
    proName,
    author,
    price,
    offer,
    category,
    subcategory,
    language,
    binding,
  } = req.body;
  const imageFile = req.file;

  const fileStream = fs.createReadStream(imageFile.path);
  const s3Params = {
    Bucket: bucketName,
    Key: imageFile.originalname,
    Body: fileStream,
    ContentType: imageFile.mimetype,
  };

  let anyProduct;

  try {
    anyProduct = await Products.findOne({ productName: proName });
  } catch (err) {
    console.log(err);
  }

  if (anyProduct) {
    return res.status(400).json({ message: "Product already exist" });
  }

  const command = new PutObjectCommand(s3Params);
  try {
    await s3.send(command);
  } catch (error) {
    console.log(error);
    return { error };
  }

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageFile.originalname}`;
  const key = imageFile.originalname;
  const offerPrice = Math.floor(price - (price * offer) / 100);

  const newProduct = new Products({
    productName: proName,
    author: author,
    price: price,
    offer: offer,
    category: category,
    subcategory: subcategory,
    language: language,
    binding: binding,
    image: imageUrl,
    imageKey: key,
    offerprice: offerPrice,
  });

  try {
    await newProduct.save();
  } catch (err) {
    console.log(err);
  }

  await Category.updateOne(
    { name: category, "subCategories.name": subcategory },
    { $inc: { productCount: 1, "subCategories.$.productCount": 1 } }
  );

  return res.status(201).json({ message: newProduct });
};

//Get the details of all Products

const getProduct = async (req, res, next) => {
  let products;
  try {
    products = await Products.find();
  } catch (err) {
    console.log(err);
  }
  if (products) {
    return res.status(200).json({ products });
  } else {
    return res
      .status(400)
      .json({ message: "No Data Found in Products Collection" });
  }
};

exports.addcategory = addcategory;
exports.getCategory = getCategory;
exports.addSubCategory = addSubCategory;
exports.getSub = getSub;
exports.addProduct = addProduct;
exports.getProduct = getProduct;
