import Cart from "../models/cart.model.js";

class CartManager {
  async getAll() {
    try {
      const cart = await Cart.find().populate("products.product")
      return cart
    } catch (error) {
      throw error
    }
  }

  async insertOne() {
    try {
      const newCart = new Cart({ products: [] })
      newCart.createdAt = new Date()
      newCart.updatedAt = new Date()
      await newCart.save()
      return newCart
    } catch (error) {
      throw error
    }
  }

  async findOne(cid) {
    try {
      const cart = await Cart.findById(cid)
      if (!cart) throw new Error(`Cart ${cid} not found`);
      return cart
    } catch (error) {
      throw error
    }
  }

  async addProductToCart(cid, pid, quantity = 1) {
    try {
      const cart = await this.findOne(cid)
      if (!cart) throw new Error(`Cart ${cid} not found`);
      const productExist = cart.products.find(item => item.product._id.toString() === pid)
      if(!productExist)  throw new Error(`Product ${pid} not found`);
      productExist ? productExist.quantity += quantity : cart.products.push({ product: pid, quantity })
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw error
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await this.findOne(cid)
      if (!cart) throw new Error(`Cart ${cid} not found`);
      const productExist = cart.products.find(item => item.product._id.toString() === pid)
      if(!productExist)  throw new Error(`Product ${pid} not found`);
      productExist.quantity = quantity
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw error
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await this.findOne(cid)
      if (!cart) throw new Error(`Cart ${cid} not found`);
      const filtredProduct = cart.products.filter(item => item.product._id.toString() !== pid)
      if(!filtredProduct)  throw new Error(`Product ${pid} not found`);
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw error
    }
  }
  
  async emptyCart(cid) {
    try {
      const cart = await this.findOne(cid)
      if (!cart) throw new Error(`Cart ${cid} not found`);
      cart.products = []
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw error
    }
  }
  
  async updateCart(cid, cartData) {
    try { 
      const cart = await this.findOne(cid)
      if (!cart) throw new Error(`Cart ${cid} not found`);
      cart.products = cartData
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw error
    }
  }
}


export default CartManager