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
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}