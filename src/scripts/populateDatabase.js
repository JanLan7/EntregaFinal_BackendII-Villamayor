import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";

const MONGO_URI = "mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/Sessions?retryWrites=true&w=majority&appName=Cluster0";

const populateDatabase = async () => {
    try {
        console.log("Conectando a la base de datos...");
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a la base de datos");

        // Verificar si ya existen servicios o productos
        const existingServices = await ProductModel.find({ category: "Servicio" });
        const existingProducts = await ProductModel.find({ category: "Producto" });

        if (existingServices.length > 0 || existingProducts.length > 0) {
            console.log("Ya existen servicios o productos en la base de datos. No se agregarán duplicados.");
            return;
        }

        const services = [
            {
                name: "Creación de Página Web Básica",
                description: "Diseño y desarrollo de una página web básica.",
                price: 300,
                stock: 10,
                category: "Servicio"
            },
            {
                name: "Mantenimiento de Página Web",
                description: "Servicio de mantenimiento mensual para tu página web.",
                price: 150,
                stock: 20,
                category: "Servicio"
            },
            {
                name: "Optimización SEO",
                description: "Mejoramos el posicionamiento de tu página web en buscadores.",
                price: 200,
                stock: 15,
                category: "Servicio"
            }
        ];

        const products = [
            {
                name: "Laptop Dell Inspiron",
                description: "Laptop de alto rendimiento para desarrollo.",
                price: 1200,
                stock: 5,
                category: "Producto"
            },
            {
                name: "Monitor Samsung 24 pulgadas",
                description: "Monitor Full HD ideal para programación.",
                price: 250,
                stock: 10,
                category: "Producto"
            },
            {
                name: "Teclado Mecánico Logitech",
                description: "Teclado mecánico con retroiluminación RGB.",
                price: 100,
                stock: 20,
                category: "Producto"
            }
        ];

        console.log("Insertando servicios y productos...");
        await ProductModel.insertMany([...services, ...products]);
        console.log("Servicios y productos creados exitosamente");
    } catch (error) {
        console.error("Error al poblar la base de datos:", error);
    } finally {
        console.log("Cerrando la conexión a la base de datos...");
        mongoose.disconnect();
    }
};

populateDatabase();
