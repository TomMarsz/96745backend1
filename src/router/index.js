import apiProductsController from "../controllers/apiProducts.controller.js";
import apiCartsController from "../controllers/apiCarts.controller.js";
import productsController from "../controllers/products.controller.js"

const router = app => {
  app.use("/api/products", apiProductsController);
  app.use("/api/carts", apiCartsController);
  app.use("/products", productsController)
}

export default router