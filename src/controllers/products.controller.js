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
    res.status(HTTP_RESPONSES.SUCCESS).render("products.handlebars", { response, title: "Products", style: "products.css" });
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

export default router