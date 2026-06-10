import express from "express";
import productosRoutes from "./routes/productos.routes";
import cors from "cors"

const app = express();

app.use(cors())
app.use(express.json());

app.use("/productos", productosRoutes);

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});