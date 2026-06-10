function viewProducts() {
    const container = document.getElementById("container-product")



    fetch("http://localhost:3000/productos")
        .then(response => response.json())
        .then(productos => {
            container.innerHTML = ""
            productos.forEach(producto => {
                container.innerHTML += `
                <div class="container-product">
                    <div class="img-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}"/>
                </div>
                <div>
                    <h2>${producto.nombre}</h2>
                    <p>${producto.descripcion}</p>
                    <p>${producto.precio}</p>
                </div>
                <input type="button" value="Eliminar">
                </div>
                
                `

            });
        })
        .catch(error => console.error(error));

}

viewProducts()

function uploadProduct(e) {
    event.preventDefault()

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const fileInput = document.getElementById("file");


    const formdata = new FormData();
    formdata.append("nombre", nombre);
    formdata.append("descripcion", descripcion);
    formdata.append("precio", precio);
    formdata.append("file", fileInput.files[0]);

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    fetch("http://localhost:3000/productos/create", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            viewProducts()
        })
        .catch((error) => console.error(error));
}

function addProduct() {
    const container = document.getElementById("products-container")

    const index = container.children.length

    const div = document.createElement("div")

    div.classList.add("product")

    div.innerHTML = `
        <h3>Producto ${index + 1}</h3>

        <input type="text" class="nombre" placeholder="Nombre">
        <input type="text" class="descripcion" placeholder="Descripción">
        <input type="text" class="precio" placeholder="Precio">

        <input type="file" class="file">
    `

    container.appendChild(div)
}

function uploadManyProduct(event) {
    event.preventDefault()

    const container = document.getElementById("products-container")
    const productsDivs = container.querySelectorAll(".product")

    const formData = new FormData()
    const productos = []

    productsDivs.forEach(div => {
        const nombre = div.querySelector(".nombre").value
        const descripcion = div.querySelector(".descripcion").value
        const precio = div.querySelector(".precio").value
        const file = div.querySelector(".file").files[0]

        productos.push({
            nombre,
            descripcion,
            precio
        })

        formData.append("file", file)
    })

    formData.append("productos", JSON.stringify(productos))

    fetch("http://localhost:3000/productos/many", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            console.log("OK:", data)
        })
        .catch(err => console.error(err))
}