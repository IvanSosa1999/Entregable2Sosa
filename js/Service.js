class Producto {
    constructor(service, cantidad) {
        this.id = service.id;
        this.marca = service.marca;
        this.precio = service.precio;
        this.cantidad = cantidad;
        this.precioTotal = service.precio;
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

const Services = [
    {
        id: 0,
        marca: "Kit Service Filtros Aire Y Aceite Benelli Trk 502 Trk502 ",
        descripcion: "kit de service para moto benelli trk 502,filtro de aceite: marca vedamotors,filtro de aire: marca wega",
        precio: 6280,
        img: "images/ServiceMotoFoto/Trk.jpg",
    },
    {
        id: 12,
        marca: "Kit Service Xr 250 Tornado Aceite Honda Hgo + Filtros",
        descripcion: "kit de service para moto xr 250 tornado, aceite: honda hgo 10w30,filtro de aceite y aire: marca wega",
        precio: 7400,
        img: "images/ServiceMotoFoto/Tornado.jpg",
    },
    {
        id: 13,
        marca: "Kit Service Yamaha Raptor 700 Aceite Yamalube + Filtro",
        descripcion: "kit service yamaha raptor 700, aceite yamalube semisintetico 10w40, filtro de aceite marca wega",
        precio: 7850,
        img: "images/ServiceMotoFoto/Raptor.jpg",
    },
    {
        id: 14,
        marca: "Kit Service Kawa Zx6 R Zx9 R Zx10 R Filtro Wander 15w50",
        descripcion: "kit de service, wander semi sintetico 15w50, filtro de aceite: marca kawasaki original",
        precio: 21905,
        img: "images/ServiceMotoFoto/NinjaZx10.jpg",
    },
];

function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoAceiteEnStorage"));

    if (contenidoEnStorage) {
        let array = [];

        for (const objeto of contenidoEnStorage) {
            let service = new Producto(objeto, objeto.cantidad);
            service.actualizarPrecioTotal();
            array.push(service);
        }

        imprimirTabla(array);

        return array;
    }

    return [];
}

function imprimirProductosEnHTML(Services) {
    let contenedor = document.getElementById("contenedor-services");
    contenedor.innerHTML = "";
    for (const Service of Services) {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="cardv2">
        <img src="${Service.img}" class="card-img-top" alt="${Service.marca}">
        <div>
          <h5 class="text-center m-4 nombre">${Service.marca}</h5>
          <p class="text-center m-4">${Service.descripcion}</p>
          <p class="text-center precio">$${Service.precio}</p>
          <button id="agregar${Service.id}" type="button" class="btn btn-dark agregar-carrito"> Agregar </button>
      </div>
        `;

        contenedor.appendChild(card);

        let boton = document.getElementById(`agregar${Service.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(Service.id));
    }

}

function agregarAlCarrito(idProducto) {
    let aceiteEnCarrito = carrito.find((service) => service.id === idProducto);

    if (aceiteEnCarrito) {
        let index = carrito.findIndex((elemento) => elemento.id === aceiteEnCarrito.id);
        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        let cantidad = 1;
        carrito.push(new Producto(Services[idProducto], cantidad));
    }

    localStorage.setItem("carritoAceiteEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
    let service = carrito.find((service) => service.id === id);
    let index = carrito.findIndex((element) => element.id === service.id);

    if (service.cantidad > 1) {
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

    for (let service of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${service.marca}</td>
                <td>${service.cantidad}</td>
                <td>$${service.precioTotal}</td>
                <td><button id="eliminar${service.id}" class="btn btn-dark">Eliminar</button></td>
      `;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${service.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(service.id));
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
    let arrayFiltrado = Services.filter((elemento) => elemento.marca.toLowerCase().includes(ingreso));

    imprimirProductosEnHTML(arrayFiltrado);
}

let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

imprimirProductosEnHTML(Services);

const carrito = chequearCarritoEnStorage();
