import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect("mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/Sessions?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados con éxito"))
    .catch(() => console.log("Error al conectar con la base de datos"));