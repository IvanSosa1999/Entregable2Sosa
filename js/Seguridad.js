class Producto {
    constructor(seguridad, cantidad) {
        this.id = seguridad.id;
        this.marca = seguridad.marca;
        this.precio = seguridad.precio;
        this.cantidad = cantidad;
        this.precioTotal = seguridad.precio;
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

const Seguridades = [
    {
        id: 0,
        marca: "Cadena Linga 1.10 Cementada Para Moto O Bicicleta",
        descripcion: "Cadena de 100cm con eslabones de acero cementado y templado de 10mm resistentes al corte. ",
        precio: 5500,
        img: "images/Seguridad/CadenaCandado.jpg",
    },
    {
        id: 1,
        marca: "Casco Bicicleta Skate Rollers Vertigo Vx Free Style",
        descripcion: "El complemento necesario para tus actividades.Este casco te dará comodidad y seguridad.",
        precio: 7700,
        img: "images/Seguridad/CascoVx.jpg",
    },
    {
        id: 2,
        marca: "Chaleco Reflectivo Fluo Seguridad Auto Moto Mac By Ls2",
        descripcion: "amarillo fluorescente con banda reflectante sin ángulo de 360 grados lo mantiene seguro.",
        precio: 3790,
        img: "images/Seguridad/Chaleco.jpg",
    },
    {
        id: 3,
        marca: "Traba Disco Con Alarma 110db Candado Moto Bici Reforzado",
        descripcion: "Candado con Alarma Traba Disco de freno. Desarrollado en aleación de acero de alta resistencia, ultra Resistente.",
        precio: 10640,
        img: "images/Seguridad/TrabaDisco.jpg",
    },
];

function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoAceiteEnStorage"));

    if (contenidoEnStorage) {
        let array = [];

        for (const objeto of contenidoEnStorage) {
            let seguridad = new Producto(objeto, objeto.cantidad);
            seguridad.actualizarPrecioTotal();
            array.push(seguridad);
        }

        imprimirTabla(array);

        return array;
    }

    return [];
}

function imprimirProductosEnHTML(Seguridades) {
    let contenedor = document.getElementById("contenedor-seguridades");
    contenedor.innerHTML = "";
    for (const Seguridad of Seguridades) {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="cardv2">
        <img src="${Seguridad.img}" class="card-img-top" alt="${Seguridad.marca}">
        <div>
          <h5 class="text-center m-4">${Seguridad.marca}</h5>
          <p class="text-center m-4">${Seguridad.descripcion}</p>
          <p class="text-center"><strong>$${Seguridad.precio}</strong></p>
        </div>
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                         <button id="agregar${Seguridad.id}" type="button" class="btn btn-dark"> Agregar </button>
                     </div>
      </div>
        `;

        contenedor.appendChild(card);

        let boton = document.getElementById(`agregar${Seguridad.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(Seguridad.id));
    }

}

function agregarAlCarrito(idProducto) {
    let aceiteEnCarrito = carrito.find((seguridad) => seguridad.id === idProducto);

    if (aceiteEnCarrito) {
        let index = carrito.findIndex((elemento) => elemento.id === aceiteEnCarrito.id);
        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        let cantidad = 1;
        carrito.push(new Producto(Seguridades[idProducto], cantidad));
    }

    localStorage.setItem("carritoAceiteEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
    let seguridad = carrito.find((seguridad) => seguridad.id === id);
    let index = carrito.findIndex((element) => element.id === seguridad.id);

    if (seguridad.cantidad > 1) {
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

    for (let seguridad of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${seguridad.marca}</td>
                <td>${seguridad.cantidad}</td>
                <td>$${seguridad.precioTotal}</td>
                <td><button id="eliminar${seguridad.id}" class="btn btn-dark">Eliminar</button></td>
      `;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${seguridad.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(seguridad.id));
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
    let arrayFiltrado = Seguridades.filter((elemento) => elemento.marca.toLowerCase().includes(ingreso));

    imprimirProductosEnHTML(arrayFiltrado);
}

let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

imprimirProductosEnHTML(Seguridades);

const carrito = chequearCarritoEnStorage();
