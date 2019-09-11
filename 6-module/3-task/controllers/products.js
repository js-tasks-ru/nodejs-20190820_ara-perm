const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
   
 const searchParam = (ctx.query && ctx.query.query) ? {$text: {$search: ctx.query.query}} : {}
 const products = await Product.find(searchParam);

  ctx.status = 200;
  ctx.body = {products: products};
};
