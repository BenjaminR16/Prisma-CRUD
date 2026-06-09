import express from "express";
import productosRoutes from "./routes/productos.routes";

const app = express();

app.use(express.json());

app.use("/productos", productosRoutes);

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});