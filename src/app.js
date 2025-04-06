import express from "express";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import "./database.js";
import viewsRouter from "./router/views.router.js";
import sessionsRouter from "./router/session.router.js";
import passport from "./config/passport.js";
import cookieParser from "cookie-parser";
import cartsRouter from "./router/carts.router.js";
import productsRouter from "./router/products.router.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const fileStore = FileStore(session);

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.error("Error al conectar con la base de datos:", error));

//middleware

//handlebars
app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        multiply: (price, quantity) => price * quantity,
        calculateTotal: (products) => {
            return products.reduce((total, item) => total + item.product.price * item.quantity, 0);
        }
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//middleware express
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/Sessions?retryWrites=true&w=majority&appName=Cluster0"
    })
}));

app.use(passport.initialize());

//rutas
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

//listen
app.listen(PORT, ()=> console.log(`Servidor escuchando en el puerto ${PORT}`));