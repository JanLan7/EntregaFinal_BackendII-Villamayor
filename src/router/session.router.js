import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

const router = Router();

//ruta para registrar nuevo usuario
router.post("/register", async(req,res)=>{
    const {first_name, last_name, email, password, age} = req.body;
    try {
        const existeUsuario = await UserModel.findOne({email: email})

        if (existeUsuario){
            return res.status(400).send("El email ya esta registrado")
        }

        const nuevoUsuario = await UserModel.create({
            first_name, 
            last_name, 
            email, 
            password, 
            age
        })

        res.redirect("/login")
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fatal")
    }
})

//ruta para login
router.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    try {
        const usuario = await UserModel.findOne({email})
        if(!usuario){
            return res.status(404).send("Usuario no encontrado")
        }
        if(!bcrypt.compareSync(password, usuario.password)){
            return res.status(401).send("Contraseña incorrecta")
        }
        
        const token = jwt.sign({ id: usuario._id }, 'secretCoder', { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true });
        res.redirect("/profile");
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor")
    }
})

//ruta para obtener el usuario actual
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

//logout
router.get("/logout", (req,res)=>{
    res.clearCookie('jwt');
    res.redirect("/login")
})

export default router;