import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    }],
    status: {
      type: Boolean,
      default: true
    },
    createdAt: Date,
    updatedAt: Date
  });

  cartSchema.pre("findOne", function(next) {
    this.populate("products.product")
    next()
  })

const Cart = mongoose.model('carts', cartSchema)

export default Cart