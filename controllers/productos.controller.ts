import { productosViewService, productCreateService, productUpdateService } from "../services/productos.services";

export async function productViewController(req: any, res: any) {
    const productos = await productosViewService();
    res.status(200).send(productos);
}

export async function productCreateController(req: any, res: any) {
    try {
        const { nombre, descripcion, precio } = req.body;
        const file = req.file
        console.log("respuest aFile:", file)
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


export async function productUpdateController(req: any, res: any) {
    try {
        const { id, newNombre, newDescription, newPrice } = req.body
        const newFile = req.file
        const update = await productUpdateService(id, newNombre, newDescription, newPrice, newFile)

        res.status(200).send(update)
    } catch (error: any) {
        res.status(204).send({
            status: 204,
            message: "Error al crear el producto",
            error: error.message,
        });
    }
}