const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true},
    price: { type: Number, required: true},
    productImage: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);