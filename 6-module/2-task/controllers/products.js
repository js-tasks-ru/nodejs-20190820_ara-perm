const mongoose = require('mongoose');
const Product = require('../models/Product');


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  

  if (ctx.query && ctx.query.subcategory) {
    if (mongoose.Types.ObjectId.isValid(ctx.query.subcategory)){
        const products = await Product.find({subcategory: ctx.query.subcategory})
        ctx.status = 200;
        ctx.body = {products: products};
    } else {
        ctx.status = 404;
        ctx.body = {products: []};
    }

  } else {

   return next();

  }
 
};

module.exports.productList = async function productList(ctx, next) {
  
  const products = await Product.find({});
  ctx.status = 200;
  ctx.body = {products: products}
  
};

module.exports.productById = async function productById(ctx, next) {

  const id = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)){
    ctx.status = 400;
    ctx.body = 'This Product ID is invalid';
    return ;  
  }

  const product = await Product.findById(id);
  
  if (!product) {
    ctx.status = 404;
    ctx.body = 'Product with this ID is not found';
    return;
  }
  
  ctx.status = 200;
  ctx.body = {product: product};
};

