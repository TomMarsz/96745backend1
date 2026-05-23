import { Router } from "express";
import ProductManager from "../managers/products.manager.js";
import HTTP_RESPONSES from "../constants/http-responses.constant.js";

const router = Router()
const productManager = new ProductManager()

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort } = req.query
  const filter = {}
  try {
    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
    const options = {
      page: page,
      limit: limit,
      sort: sortOption
    }
    const result = await productManager.getAll(filter, options);
    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    };
    res.status(HTTP_RESPONSES.SUCCESS).json({ response });
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});


router.get("/:pid", async (req, res) => {
  const { pid } = req.params
  try {
    const productById = await productManager.findOne(pid)
    res.status(HTTP_RESPONSES.SUCCESS).json({ response: productById })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  const { title, description, price, stock, category } = req.body
  try {
    const newProductInfo = { title, description, price, stock, category }
    const newProduct = await productManager.insertOne(newProductInfo)
    res.status(HTTP_RESPONSES.CREATED).json({ response: { newProduct } })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.put("/:pid", async (req, res) => {
  const { pid } = req.params
  const { title, description, price, stock, category } = req.body
  try {
    if (!title || !description || !price || !stock || !category) return res.status(HTTP_RESPONSES.BAD_REQUEST).json({ error: error.message })
    const productInfo = { title, description, price, stock, category }
    const updatedProduct = await productManager.updateOne(pid, productInfo)
    res.status(HTTP_RESPONSES.ACCEPTED).json({ payload: { updatedProduct } })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params
  try {
    const deletedProduct = await productManager.deleteOne(pid)
    res.status(HTTP_RESPONSES.ACCEPTED).json({ payload: { deletedProduct } })
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
})

export default router