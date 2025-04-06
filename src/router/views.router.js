import { Router } from "express";
import passport from "passport";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const router = Router();

router.get("/login", (req,res)=>{
    if(req.cookies.jwt) {
        return res.redirect('/profile');
    }
    res.render("login");
});

router.get("/register", (req,res)=>{
    if(req.cookies.jwt) {
        return res.redirect('/profile');
    }
    res.render("register");
});

// Crear un carrito automáticamente si no existe
router.get("/profile", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await CartModel.create({ user: req.user._id, products: [] });
        }
        res.render("profile", { user: { ...req.user.toObject(), cart: cart._id } });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el perfil");
    }
});

router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
    };
    res.json(userDTO);
});

router.get("/cart/:cartId", async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await CartModel.findById(cartId).populate("products.product");
        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.render("cart", { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el carrito");
    }
});

router.get("/products", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await CartModel.create({ user: req.user._id, products: [] });
        }

        const services = await ProductModel.find({ category: "Servicio" });
        const products = await ProductModel.find({ category: "Producto" });

        res.render("products", { services, products, user: { ...req.user.toObject(), cart: cart._id } });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar los productos");
    }
});

router.get("/products/servicios", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await CartModel.create({ user: req.user._id, products: [] });
            console.log(`Nuevo carrito creado para el usuario ${req.user._id}: ${cart._id}`);
        }

        const services = await ProductModel.find({ category: "Servicio" });

        res.render("category", { 
            category: "Servicios", 
            items: services, 
            user: { ...req.user.toObject(), cart: cart._id.toString() } 
        });
    } catch (error) {
        console.error("Error al cargar los servicios:", error);
        res.status(500).send("Error al cargar los servicios");
    }
});

router.get("/products/productos", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await CartModel.create({ user: req.user._id, products: [] });
            console.log(`Nuevo carrito creado para el usuario ${req.user._id}: ${cart._id}`);
        }

        const products = await ProductModel.find({ category: "Producto" });

        res.render("category", { 
            category: "Productos", 
            items: products, 
            user: { ...req.user.toObject(), cart: cart._id.toString() } 
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).send("Error al cargar los productos");
    }
});

router.get("/products/:category", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { category } = req.params;
        
        // Asegurar que el usuario tiene un carrito
        let cart = await CartModel.findOne({ user: req.user._id });
        if (!cart) {
            cart = await CartModel.create({ 
                user: req.user._id, 
                products: [] 
            });
            console.log('Nuevo carrito creado:', cart._id);
        }

        // Obtener productos según la categoría
        const items = await ProductModel.find({ 
            category: category === "servicios" ? "Servicio" : "Producto" 
        });

        res.render("category", {
            category: category === "servicios" ? "Servicios" : "Productos",
            items,
            user: {
                ...req.user.toObject(),
                cart: cart._id.toString()
            }
        });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;