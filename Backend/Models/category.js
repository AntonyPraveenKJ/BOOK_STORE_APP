const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const subCategorySchema = new Schema({
    name: { type: String, required: true },
    productCount: { type: Number, default: 0 }
});

const categorySchema = new Schema({
    name: { type: String, required: true },
    subCategories: [subCategorySchema],
    productCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Categories', categorySchema);