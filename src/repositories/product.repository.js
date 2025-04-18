import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
    async getProductById(productId) {
        return await ProductDAO.getProductById(productId);
    }

    async updateProductStock(productId, stock) {
        return await ProductDAO.updateProductStock(productId, stock);
    }

    async createProduct(data) {
        return await ProductDAO.createProduct(data);
    }
}

export default new ProductRepository();
