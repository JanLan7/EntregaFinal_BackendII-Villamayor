import { Router } from "express";
import ProductRepository from "../repositories/product.repository.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Ruta para crear un producto (solo administradores)
router.post("/", authorize(["admin"]), async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
        const product = await ProductRepository.createProduct({ name, description, price, stock });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el producto");
    }
});

// Ruta para listar todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await ProductRepository.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos");
    }
});

export default router;
