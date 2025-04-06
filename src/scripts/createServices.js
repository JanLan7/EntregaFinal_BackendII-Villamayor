import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";

const MONGO_URI = "mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/Sessions?retryWrites=true&w=majority&appName=Cluster0";

const createServices = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a la base de datos");

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
            }
        ];

        await ProductModel.insertMany(services);
        console.log("Servicios creados exitosamente");
    } catch (error) {
        console.error("Error al crear servicios:", error);
    } finally {
        mongoose.disconnect();
    }
};

createServices();
