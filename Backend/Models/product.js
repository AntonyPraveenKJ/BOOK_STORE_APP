const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const productSchema=new Schema({
    productName:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    offer:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subcategory:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    binding:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    }, 
    imageKey:{
        type:String,
        required:true
    }, 
   offerprice:{
        type:Number,
        required:true
    },
   
})

module.exports=mongoose.model('Products',productSchema)