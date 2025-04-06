import ProductModel from "../models/product.model.js";

class ProductDAO {
    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async updateProductStock(productId, stock) {
        return await ProductModel.findByIdAndUpdate(productId, { stock }, { new: true });
    }
}

export default new ProductDAO();
