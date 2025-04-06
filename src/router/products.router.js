import { Router } from "express";
import ProductModel from "../models/product.model.js";

const router = Router();

// Ruta para crear un producto
router.post("/", async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
        const product = await ProductModel.create({ name, description, price, stock });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el producto");
    }
});

// Ruta para listar todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos");
    }
});

export default router;
