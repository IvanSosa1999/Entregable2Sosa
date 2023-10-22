//const listaProductos = require('../productos.json');

const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.grid-section');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const finalizarCompra = document.querySelector('.finalizar-compra-conteiner');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

function actualizarHtml(){
	console.log("se ejecuto actualizar")
	showHTML();
}

window.onload = function() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        allProducts = JSON.parse(carritoGuardado);
        actualizarHtml(); // Actualizar la interfaz con los productos cargados
    }
};

productsList.addEventListener('click', e => {
    
	if (e.target.classList.contains('agregar-carrito')) {
       
		const product = e.target.parentElement.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('.nombre').textContent,
			price: product.querySelector('.precio').textContent,        
		};
		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
			const products = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});
			allProducts = [...products];
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

rowProduct.addEventListener('click', e => {
	
	if (e.target.classList.contains('icon-close')) {
        
		const product = e.target.parentElement;
		const title = product.querySelector('.titulo-producto-carrito').textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		console.log(allProducts);

		showHTML();
	}
});

// Funcion para mostrar  HTML
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
		finalizarCompra.classList.add('hidden');
		
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
		finalizarCompra.classList.remove('hidden');
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg mlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-shopping-cart-x icon-close" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00b341" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  			  <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
  			  <path d="M13 17h-7v-14h-2" />
  			  <path d="M6 5l14 1l-1 7h-13" />
  			  <path d="M22 22l-5 -5" />
  			  <path d="M17 22l5 -5" />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;

	localStorage.setItem('carrito', JSON.stringify(allProducts));
};
