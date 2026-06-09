import { productosViewService, productCreateService } from "../services/productos.services";

export async function productViewController(req: any, res: any) {
    const productos = await productosViewService();
    res.status(200).send(productos);
}

export async function productCreateController(req: any, res: any) {
    try {
        const { nombre, descripcion, precio } = req.body;
        const file = req.file
        // console.log("respuest aFile:", file)
        const upload = await productCreateService(nombre, descripcion, precio, file);
        res.status(201).send(upload);

    } catch (error: any) {
        res.status(500).send({
            status: 500,
            message: "Error al crear el producto",
            error: error.message,
        });
    }
}