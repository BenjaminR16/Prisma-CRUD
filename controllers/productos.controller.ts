import { productosViewService, productCreateService, productUpdateService, productRemoveService, productManyService } from "../services/productos.services";

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
        const { id, newNombre, newDescripcion, newPrrecio } = req.body
        const newFile = req.file
        const update = await productUpdateService(id, newNombre, newDescripcion, newPrrecio, newFile)

        res.status(200).send(update)
    } catch (error: any) {
        res.status(204).send({
            status: 204,
            message: "Error al crear el producto",
            error: error.message,
        });
    }
}

export async function productRemoveController(req: any, res: any) {
    try {
        const { id } = req.body
        const remove = await productRemoveService(id)
        res.status(200).send(remove)
    } catch (error: any) {
        res.status(204).send({
            status: 204,
            message: "Error al crear el producto",
            error: error.message,
        });
    }

}

export async function productManyController(req: any, res: any) {
    try {
        const productos = JSON.parse(req.body.productos)
        const files = req.files
        console.log(files)
        const uploadMany = await productManyService(productos, files)
        res.status(201).send(uploadMany);
    } catch (error: any) {
        res.status(204).send({
            status: 204,
            message: "Error al crear el producto",
            error: error.message,
        });
    }
}