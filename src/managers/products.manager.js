import Product from "../models/product.model.js";

class ProductManager {
	async getAll(filter, options) {
		try {
			const result = await Product.paginate(filter, options);
			result.docs = result.docs.map(doc => doc.toObject());
			return result;
		} catch (error) {
			throw error
		}
	}

	async insertOne(newProductInfo) {
		try {
			newProductInfo.createdAt = new Date()
			newProductInfo.updatedAt = new Date()
			return await Product.create(newProductInfo)
		} catch (error) {
			throw error
		}
	}

	async findOne(pid) {
		try {
			const product = await Product.findById(pid)
			return product
		} catch (error) {
			throw error
		}
	}

	async updateOne(pid, productInfo) {
		try {
			productInfo.updatedAt = new Date()
			await Product.findByIdAndUpdate(pid, productInfo)
			return await Product.find(pid)
		} catch (error) {
			throw error
		}
	}

	async deleteOne(pid) {
		try {
			const deletedProduct = await Product.findByIdAndDelete(pid)
			deletedProduct.updatedAt = new Date()
			return deletedProduct
		} catch (error) {
			throw error
		}
	}
}

export default ProductManager