import { prisma } from "../lib/prisma"
import { createClient } from "@supabase/supabase-js"
import 'dotenv/config'
import { error } from "node:console"

const supabase = createClient(
    process.env.SUPABASE_URL_HTTP!,
    process.env.SUPABASE_KEY!
)

export async function productosViewService() {
    const allUsers = await prisma.productos.findMany()
    console.log(allUsers)
    return allUsers
}

export async function productCreateService(nombre: any, descripcion: any, precio: any, file: any) {
    try {
        const extension = file.originalname.split(".").pop()
        const fileName = `img-${Date.now()}.${extension}`

        //subir el aarchivo sin data 
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            })

        if (error) throw error

        //conseguir la url publica con getPublicUrl y la guardo en imageUrl
        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName)

        const imageUrl = publicUrlData.publicUrl

        //guardo el data en la base de datos con el create y retorno productos 
        const productos = await prisma.productos.create({
            data: {
                nombre,
                descripcion,
                precio: Number(precio),
                imagen: imageUrl,
            },
        })
        return productos

    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function productUpdateService(id: any, newNombre: any, newDescripcion: any, newPrecio: any, newFile: any) {
    try {
        const product = await prisma.productos.findUnique({ where: { id: Number(id) } })
        // console.log(product)

        if (!product) throw new Error("Producto no encontrado")

        if (product.imagen) {
            const url = new URL(product.imagen)
            const path = url.pathname.split("/avatars/")[1]
            // console.log(path)

            if (path) {
                await supabase.storage.from("avatars").remove([path])
            }

        }

        const extension = newFile.originalname.split(".").pop()
        const fileName = `img-${Date.now()}.${extension}`

        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(fileName, newFile.buffer, {
                contentType: newFile.mimetype,
            })

        if (error) throw error

        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName)

        const imageUrl = publicUrlData.publicUrl

        const updatedProduct = await prisma.productos.update({
            where: { id: Number(id) },
            data: {
                nombre: newNombre,
                descripcion: newDescripcion,
                precio: newPrecio,
                imagen: imageUrl
            },
        })

        console.log("UPDATED:", updatedProduct)
        return updatedProduct


    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function productRemoveService(id: number) {
    const product = await prisma.productos.findUnique({ where: { id: Number(id) } })

    if (!product) throw new Error("Producto no encontrado")

    if (product.imagen) {
        const url = new URL(product.imagen)
        const path = url.pathname.split("/avatars/")[1]

        if (path) {
            await supabase.storage.from("avatars").remove([path])
        }

    }

    const removeProduct = prisma.productos.delete({ where: { id: Number(id) } })
    return removeProduct

}