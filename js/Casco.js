class Producto {
    constructor(casco, cantidad) {
        this.id = casco.id;
        this.marca = casco.marca;
        this.precio = casco.precio;
        this.cantidad = cantidad;
        this.precioTotal = casco.precio;
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

const Cascos = [
    {
        id: 4,
        marca: "Nzi Trendy",
        descripcion: "Casco integral con un diseño de carcasa rabiosamente deportivo y la garantía de NZI en lo que se refiere a seguridad y confort.",
        precio: 40960,
        img: "images/Cascos/NziTrendy.jpg",
    },
    {
        id: 5,
        marca: "Nzi Knobby",
        descripcion: "casco nzi knobby enduro cross | temporada 2022 Motocross, estilo libre,el modelo Knobby esta preparado para cualquier actividad fuera de carretera.",
        precio: 47190,
        img: "images/Cascos/NziKnobby.jpg",
    },
    {
        id: 6,
        marca: "Mac Virtus",
        descripcion: "Llega mac virtus.Para vos, que ves el mundo de otra manera, que te cuidás no porque te lo dicen sino porque tenés otra cabeza.",
        precio: 49190,
        img: "images/Cascos/MacVirtus.jpg",
    },
    {
        id: 7,
        marca: "MacBeatSolid",
        descripcion: "El casco más Compacto y Liviano. La ligereza y la protección se combinan en la nueva propuesta de casco abierto MAC.",
        precio: 31090,
        img: "images/Cascos/MacBeatSolid.jpg",
    },
];

function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoAceiteEnStorage"));

    if (contenidoEnStorage) {
        let array = [];

        for (const objeto of contenidoEnStorage) {
            let casco = new Producto(objeto, objeto.cantidad);
            casco.actualizarPrecioTotal();
            array.push(casco);
        }

        imprimirTabla(array);

        return array;
    }

    return [];
}

function imprimirProductosEnHTML(Cascos) {
    let contenedor = document.getElementById("contenedor-cascos");
    contenedor.innerHTML = "";
    for (const Casco of Cascos) {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="cardv2">
        <div>
        <img src="${Casco.img}" class="card-img-top imagenProducto" alt="${Casco.marca}">        
          <h5 class="text-center m-4 nombre">${Casco.marca}</h5>
          <p class="text-center m-4">${Casco.descripcion}</p>
          <p class="text-center precio">$${Casco.precio}</p>
          <button id="agregar${Casco.id}" type="button" class="btn btn-dark agregar-carrito"> Agregar </button>
      </div>
        `;

        contenedor.appendChild(card);

        let boton = document.getElementById(`agregar${Casco.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(Casco.id));
    }

}

function agregarAlCarrito(idProducto) {
    let aceiteEnCarrito = carrito.find((casco) => casco.id === idProducto);

    if (aceiteEnCarrito) {
        let index = carrito.findIndex((elemento) => elemento.id === aceiteEnCarrito.id);
        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        let cantidad = 1;
        carrito.push(new Producto(Cascos[idProducto], cantidad));
    }

    localStorage.setItem("carritoAceiteEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
    let casco = carrito.find((casco) => casco.id === id);
    let index = carrito.findIndex((element) => element.id === casco.id);

    if (casco.cantidad > 1) {
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

    for (let casco of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${casco.marca}</td>
                <td>${casco.cantidad}</td>
                <td>$${casco.precioTotal}</td>
                <td><button id="eliminar${casco.id}" class="btn btn-dark">Eliminar</button></td>
      `;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${casco.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(casco.id));
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
    let arrayFiltrado = Cascos.filter((elemento) => elemento.marca.toLowerCase().includes(ingreso));

    imprimirProductosEnHTML(arrayFiltrado);
}

let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

imprimirProductosEnHTML(Cascos);

const carrito = chequearCarritoEnStorage();
