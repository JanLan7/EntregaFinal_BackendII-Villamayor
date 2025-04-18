import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app);

describe("Carrito de compras", () => {
    let token;
    let cartId;

    beforeAll(async () => {
        // Iniciar sesión y obtener el token
        const loginResponse = await request.post("/api/sessions/login").send({
            email: "user@example.com",
            password: "password123"
        });
        token = loginResponse.body.token;

        // Crear un carrito
        const cartResponse = await request.post("/api/carts").set("Authorization", `Bearer ${token}`).send({
            userId: "userId"
        });
        cartId = cartResponse.body._id;
    });

    it("Debería agregar un producto al carrito", async () => {
        const response = await request.post(`/api/carts/${cartId}/products`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: "productId",
                quantity: 2
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Producto agregado al carrito exitosamente");
    });

    it("Debería finalizar la compra", async () => {
        const response = await request.post(`/api/carts/${cartId}/purchase`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.ticket).toBeDefined();
    });
});
