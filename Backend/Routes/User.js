const express=require('express');
const { signup, login, verifyToken, getUser, refreshToken, logout, addToCart, getCartProducts } = require('../Controllers/userControllers');
const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/',verifyToken,getUser);
router.get('/refresh',refreshToken,verifyToken,getUser);
router.post('/logout',verifyToken,logout)
router.post('/addToCart',addToCart);
router.post('/getCartProducts',getCartProducts)

module.exports=router;