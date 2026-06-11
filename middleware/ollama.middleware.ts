import { json } from 'node:stream/consumers';
import ollama from 'ollama';

export async function ollamaMiddleware(req: any, res: any, next: any) {
    const files = req.files // NO SE COMO MANDAR LA IMAGEN CON URL PUBLICA, SE UNA CON UN MAP Y LISTO 
    const productos = req.body.productos ? JSON.parse(req.body.productos) : [{
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio
    }]

    const esquemaJSON = {
        type: 'object',
        properties: {
            aprobado: { type: 'boolean' },
            motivo: { type: 'string' }
        },
        required: ['aprobado', 'motivo', 'productos']
    }

    try {

        const response = await ollama.chat({
            model: 'llama3.1',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente de que valida si un producto se crea o no, debes evaluar cada producto por separado. Tienes que evaluar el nombre, descripcion y el precio del producto siguiendo estos criterios: nombre coherente, descripcion util, precio acorde al producto. Una vez el producto sea valido debes responer "Producto valido" y si no es valido "Producto no valido". Debes responder estrictamente siguiendo el esquema JSON provisto. '
                },
                {
                    role: 'user',
                    content: `Analiza esto: ${JSON.stringify(productos)}`
                }
            ],
            format: esquemaJSON,
            options: {
                temperature: 0
            }
        })

        const jsonResultado = JSON.parse(response.message.content);
        console.log(jsonResultado);

        if (jsonResultado.aprobado) {
            next()
        } else {
            res.status(500).send(jsonResultado.motivo)
        }


    } catch (error: any) {
        res.status(500).send({
            status: 500,
            message: "Error al crear el producto",
            error: error.message,
        })
    }

}


export async function ollamaManyMiddleware(req: any, res: any, next: any) {
    // const files = req.files // NO SE COMO MANDAR LA IMAGEN CON URL PUBLICA, SE UNA CON UN MAP Y LISTO 
    const productos = req.body.productos ? JSON.parse(req.body.productos) : [{
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio
    }]

    const esquemaJSON = {
        type: 'object',

        properties: {
            productos: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        aprobado: { type: 'boolean' },
                        motivo: { type: 'string' }
                    },
                    required: [
                        'aprobado',
                        'motivo'
                    ]
                }
            }
        },

        required: ['productos']
    }

    try {

        const response = await ollama.chat({
            model: 'llama3.1',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente de que valida si un producto se crea o no, debes evaluar cada producto por separado. Tienes que evaluar el nombre, descripcion y el precio del producto siguiendo estos criterios: nombre coherente, descripcion util, precio acorde al producto. Una vez el producto sea valido debes responer "Producto valido" y si no es valido "Producto no valido". Debes responder estrictamente siguiendo el esquema JSON provisto. '
                },
                {
                    role: 'user',
                    content: `Analiza esto: ${JSON.stringify(productos)}`
                }
            ],
            format: esquemaJSON,
            options: {
                temperature: 0
            }
        })

        const jsonResultado = JSON.parse(response.message.content)

        console.log(jsonResultado)

        const resultado = productos.filter(
            (product: any, index: number) =>
                jsonResultado.productos[index].aprobado === true
        )

        console.log(resultado)
        req.body.productos = JSON.stringify(resultado)
        next()

    } catch (error: any) {
        res.status(500).send({
            status: 500,
            message: "Error al crear el producto",
            error: error.message,
        })
    }

}

