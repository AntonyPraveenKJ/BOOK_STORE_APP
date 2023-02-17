const express=require('express');
const { addcategory, getCategory, addSubCategory, getSub, addProduct, getProduct } = require('../Controllers/adminControllers');
const router=express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/addNewCategory',addcategory);
router.get('/getCategory',getCategory);
router.put('/addmoresub',addSubCategory);
router.post('/getSub',getSub);
router.post('/addNewProduct',upload.single('image'),addProduct);
router.get('/getAllProducts',getProduct);

module.exports=router;