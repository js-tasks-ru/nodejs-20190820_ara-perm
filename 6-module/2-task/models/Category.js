const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
}
);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
  }
);

subCategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});


/*categorySchema.virtual('id').get(function(){
  return this._id.toHexString();
});*/
//subCategorySchema.set('toObject', {virtuals: true});
categorySchema.set('toObject', {getters: true});

/*categorySchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  return ret;
}*/

module.exports = connection.model('Category', categorySchema);
