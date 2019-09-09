const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  
  //console.log(`----PARAMS=${ctx.request.body}`);
  console.log(ctx.request.body);
  ctx.body = {products: []};
  
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({}).populate('category').populate('subcategory');
  ctx.body = {products: products};
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

