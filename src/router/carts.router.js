import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import TicketModel from "../models/ticket.model.js";

const router = Router();

// Crear un carrito para un usuario
router.post("/", async (req, res) => {
    const { userId } = req.body;
    try {
        const cart = await CartModel.create({ user: userId, products: [] });
        res.status(201).json(cart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crear el carrito");
    }
});

// Agregar un producto al carrito
router.post("/:cartId/products", async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
        console.log(`Recibido: cartId=${cartId}, productId=${productId}, quantity=${quantity}`);

        // Validar que cartId y productId sean ObjectId válidos
        if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
            console.error("Error: cartId no es válido o está vacío");
            return res.status(400).json({ error: "El ID del carrito no es válido o está vacío" });
        }

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            console.error("Error: productId no es válido o está vacío");
            return res.status(400).json({ error: "El ID del producto no es válido o está vacío" });
        }

        if (!quantity || quantity <= 0) {
            console.error("Error: La cantidad es inválida");
            return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
        }

        // Verificar si el carrito existe
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            console.error("Error: Carrito no encontrado");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Verificar si el producto existe
        const product = await ProductModel.findById(productId);
        if (!product) {
            console.error("Error: Producto no encontrado");
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            console.error("Error: Stock insuficiente");
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        // Buscar si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product.equals(productId));
        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity, 10);
        } else {
            cart.products.push({ product: productId, quantity: parseInt(quantity, 10) });
        }

        // Guardar el carrito actualizado
        await cart.save();

        // Reducir el stock del producto
        product.stock -= parseInt(quantity, 10);
        await product.save();

        console.log("Producto agregado al carrito exitosamente");
        res.status(200).json({ message: "Producto agregado al carrito exitosamente" });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ver el carrito
router.get("/:cartId", async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await CartModel.findById(cartId).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error al obtener el carrito");
    }
});

// Finalizar compra
router.post("/:cid/purchase", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findById(cid).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");

        let totalAmount = 0;
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await product.save();
            } else {
                unavailableProducts.push(product._id);
            }
        }

        const ticket = await TicketModel.create({
            code: uuidv4(),
            amount: totalAmount,
            purchaser: req.user.email
        });

        cart.products = cart.products.filter(item =>
            unavailableProducts.includes(item.product._id)
        );
        await cart.save();

        res.status(200).json({
            ticket,
            unavailableProducts
        });
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).send("Error al procesar la compra");
    }
});

export default router;
