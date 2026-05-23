import { Router } from "express";
import CartManager from "../managers/carts.manager.js";
import HTTP_RESPONSES from "../constants/http-responses.constant.js";

const router = Router()
const cartManager = new CartManager()

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAll()
    res.status(HTTP_RESPONSES.SUCCESS).json({ payload: carts })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.get("/:cid", async (req, res) => {
  const { cid } = req.params
  try {
    const cart = await cartManager.findOne(cid)
    res.status(HTTP_RESPONSES.SUCCESS).json({ payload: cart })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.insertOne()
    res.status(HTTP_RESPONSES.CREATED).json({ payload: { newCart } })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params
  const quantity = req.body.quantity || 1;
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity)
    res.status(HTTP_RESPONSES.CREATED).json({ payload: updatedCart })
  }
  catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params
  try {
    const deletedProduct = await cartManager.deleteProductFromCart(cid, pid)
    res.status(HTTP_RESPONSES.ACCEPTED).json({ payload: { deletedProduct } })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.put("/:cid", async (req, res) => {
  const { cid } = req.params
  const { products } = req.body
  try {
    const updatedCart = await cartManager.updateCart(cid, products)
    res.status(HTTP_RESPONSES.CREATED).json({ payload: updatedCart })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body
  try {
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity)
    res.status(HTTP_RESPONSES.CREATED).json({ payload: updatedCart })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params
  try {
    const emptyCart = await cartManager.emptyCart(cid)
    res.status(HTTP_RESPONSES.CREATED).json({ payload: emptyCart })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})


export default router