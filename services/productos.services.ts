import { prisma } from "../lib/prisma"
import { createClient } from "@supabase/supabase-js"
import 'dotenv/config'

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

        //UPLOAD A SUPABASE
        const { error } = await supabase.storage
            .from("avatars")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            })

        if (error) throw error

        //URL PUBLICA
        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName)

        const imageUrl = publicUrlData.publicUrl

        //GUARDAR EN BD
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