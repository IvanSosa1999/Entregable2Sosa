class Producto {
    constructor(aceite, cantidad) {
        this.id = aceite.id;
        this.marca = aceite.marca;
        this.precio = aceite.precio;
        this.cantidad = cantidad;
        this.precioTotal = aceite.precio;
    }

    agregarUnidad() {
        this.cantidad++;
    }

    quitarUnidad() {
        this.cantidad--;
    }

    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }
}

const Aceites = [
    {
        id: 0,
        marca: "Aceite YPF mineral Elaion Moto 4T 20W-50",
        descripcion: "Aceite YPF Elaion Moto 4T 20W-50 Mineral,Lubricante formulado con bases minerales de alta refinación.",
        precio: 1690,
        img: "images/Aceites/ElaionMineral.jpg",
    },
    {
        id: 1,
        marca: "Aceite Semi Sintetico Yamalube 4t 10w40",
        descripcion: "Aceite Semi Sintetico Yamalube 4t 10w40, Lubricante formulado con bases semissinteticas.",
        precio: 2675,
        img: "images/Aceites/YamalubeSemi.jpg",
    },
    {
        id: 2,
        marca: "Aceite Lubricante Ipone M4 Mineral 20w50",
        descripcion: "M4 es de alta calidad para motores de 4 tiempos que garantiza la completa lubricación y protección de su motor",
        precio: 3650,
        img: "images/Aceites/IponeM4.jpg",
    },
    {
        id: 3,
        marca: "Aceite 2t 100% Sintetico Fuchs Silkolene",
        descripcion: "Full Sintético ESTER, fabricados con Tecnologia Electrosyntec©, Exclusiva Tecnología de Aditivos",
        precio: 5255,
        img: "images/Aceites/SilkoleneSintetico2T.jpg",
    },
];

function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoAceiteEnStorage"));

    if (contenidoEnStorage) {
        let array = [];

        for (const objeto of contenidoEnStorage) {
            let aceite = new Producto(objeto, objeto.cantidad);
            aceite.actualizarPrecioTotal();
            array.push(aceite);
        }

        imprimirTabla(array);

        return array;
    }

    return [];
}

function imprimirProductosEnHTML(Aceites) {
    let contenedor = document.getElementById("contenedor-aceites");
    contenedor.innerHTML = "";
    for (const Aceite of Aceites) {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="cardv2">
        <img src="${Aceite.img}" class="card-img-top" alt="${Aceite.marca}">
        <div>
          <h5 class="text-center m-4 nombre">${Aceite.marca}</h5>
          <p class="text-center m-4">${Aceite.descripcion}</p>
          <p class="text-center precio">$${Aceite.precio}</p>
          <button id="agregar${Aceite.id}" type="button" class="btn btn-dark agregar-carrito"> Agregar </button>
            </div>
        </div>
        `;

        contenedor.appendChild(card);

        let boton = document.getElementById(`agregar${Aceite.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(Aceite.id));
    }

}

function agregarAlCarrito(idProducto) {
    let aceiteEnCarrito = carrito.find((aceite) => aceite.id === idProducto);

    if (aceiteEnCarrito) {
        let index = carrito.findIndex((elemento) => elemento.id === aceiteEnCarrito.id);
        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        let cantidad = 1;
        carrito.push(new Producto(Aceites[idProducto], cantidad));
    }

    localStorage.setItem("carritoAceiteEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
    let aceite = carrito.find((aceite) => aceite.id === id);
    let index = carrito.findIndex((element) => element.id === aceite.id);

    if (aceite.cantidad > 1) {
        carrito[index].quitarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        carrito.splice(index, 1);
    }

    swal("Producto eliminado con éxito", "", "success");

    localStorage.setItem("carritoAceiteEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarCarrito() {
    carrito.length = 0;
    localStorage.removeItem("carritoAceiteEnStorage");

    document.getElementById("carrito").innerHTML = "";
    document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
    return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function imprimirTabla(array) {
    let precioTotal = obtenerPrecioTotal(array);
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    let tabla = document.createElement("div");
    tabla.innerHTML = `
        <table id="tablaCarrito" class="table table-striped">
            <thead>         
                <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Accion</th>
                </tr>
            </thead>

            <tbody id="bodyTabla">
            </tbody>
        </table>
    `;

    contenedor.appendChild(tabla);

    let bodyTabla = document.getElementById("bodyTabla");

    for (let aceite of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${aceite.marca}</td>
                <td>${aceite.cantidad}</td>
                <td>$${aceite.precioTotal}</td>
                <td><button id="eliminar${aceite.id}" class="btn btn-dark">Eliminar</button></td>
      `;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${aceite.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(aceite.id));
    }

    let accionesCarrito = document.getElementById("acciones-carrito");
    accionesCarrito.innerHTML = `
		<h5>PrecioTotal: $${precioTotal}</h5></br>
		<button id="vaciarCarrito" onclick="eliminarCarrito()" class="btn btn-dark">Vaciar Carrito</button>
	`;
}

function filtrarBusqueda(e) {
    e.preventDefault();

    let ingreso = document.getElementById("busqueda").value.toLowerCase();
    let arrayFiltrado = Aceites.filter((elemento) => elemento.marca.toLowerCase().includes(ingreso));

    imprimirProductosEnHTML(arrayFiltrado);
}

let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

imprimirProductosEnHTML(Aceites);

const carrito = chequearCarritoEnStorage();
