import CartModel from "../models/cart.model.js";

class CartDAO {
    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate("products.product");
    }

    async createCart(userId) {
        return await CartModel.create({ user: userId, products: [] });
    }

    async updateCart(cartId, products) {
        return await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
    }
}

export default new CartDAO();
