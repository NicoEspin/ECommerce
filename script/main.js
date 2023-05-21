//variable que maneja el estado del carito
let carritoVisible = false;
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}
else {
    ready()
}

function ready() {
    // Obtener carrito guardado en localStorage
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Mostrar los elementos del carrito en la página
    const carritoItems = document.getElementsByClassName("carrito-items")[0];

    //eliminar item
    let botonesEliminarItem = document.getElementsByClassName("btn-eliminar")
    for (let i = 0; i < botonesEliminarItem.length; i++) {
        let button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }
    //sumar cantidad
    let botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad')
    for (let i = 0; i < botonesSumarCantidad.length; i++) {
        let button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad)

    }
    //restar cantidad
    let botonesRestarCantidad = document.getElementsByClassName('restar-cantidad')
    for (let i = 0; i < botonesRestarCantidad.length; i++) {
        let button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad)
    }
    //agregar al carrito
    let botonesAgregarAlCarrito = document.getElementsByClassName('boton-item')
    for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
        let button = botonesAgregarAlCarrito[i]
        button.addEventListener('click', agregarAlCarritoClicked);

    }
    //Boton pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}



// Elimino el item del carrito

function eliminarItemCarrito(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();

    // Actualiza el total del carrito
    actualizarTotalCarrito();
    //revisa si tengo items en el carrito, sino lo oculta
    ocultarCarrito()
    // Actualizar el carrito en localStorage
    const carrito = obtenerItemsCarrito();
    actualizarCarritoLocalStorage(carrito);
}

//Actualiza el total del carrito


function actualizarTotalCarrito() {
    //selecciona el contenedor carrito
    let carritoContenedor = document.getElementsByClassName('carrito')[0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;
    //recorre cada elemento del carrito para actualizar el total
    for (let i = 0; i < carritoItems.length; i++) {
        let item = carritoItems[i];
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        //quita el simobolo peso y el punto de milesimos
        let precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        console.log(precio);
        let cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";

}
//Funciòn que controla si hay elementos en el carrito. Si no hay oculto el carrito.
function ocultarCarrito() {
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        let carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        let items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}
//aumento en uno la cantidad de el elemento seleccionado 
function sumarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
    // Actualizar el carrito en localStorage
    const carrito = obtenerItemsCarrito();
    actualizarCarritoLocalStorage(carrito);
}
//resto en uno la cantidad del elemento seleccionado
function restarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
        // Actualizar el carrito en localStorage
        const carrito = obtenerItemsCarrito();
        actualizarCarritoLocalStorage(carrito);
    }
}


function agregarAlCarritoClicked(event) {
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    console.log(titulo);
    let precio = item.getElementsByClassName('precio-item')[0].innerText;
    let imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlcarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
    actualizarTotalCarrito();
}
//funcion para agregar un item nuevo al carrito
function agregarItemAlcarrito(titulo, precio, imagenSrc) {
    // Actualizar el carrito en localStorage
    const carrito = obtenerItemsCarrito();
    actualizarCarritoLocalStorage(carrito);
    let item = document.createElement('div');
    item.classList.add = 'item'
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //vemos si el item ingresado ya esta en el carrito
    let nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            // sweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El item ya se encuentra en el carrito'
            })
            return;
        }
    }
    let itemCarritoContenido = ` 
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);
    //funcionalidad de eliminar nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    //funcionalidad sumar nuevo item
    let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad)
    //funcionalidad restar nuevo item
    let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad)


}
function pagarClicked(event) {
    // sweetAlert
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Gracias por su compra!',
        showConfirmButton: false,
        timer: 1500
      })
    //elimino los items del carrito
    let carritoItems = document.getElementsByClassName('carrito-items')[0]

    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito()
}
//Funcion que hace visible el carrito
function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}
//Local storage
function actualizarCarritoLocalStorage(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function obtenerItemsCarrito() {
    const carritoItems = document.getElementsByClassName("carrito-items")[0];
    const items = carritoItems.getElementsByClassName("carrito-item");
    const carrito = [];
    for (const item of items) {
        const titulo = item.getElementsByClassName("carrito-item-titulo")[0].innerText;
        const precio = item.getElementsByClassName("carrito-item-precio")[0].innerText;
        const cantidad = item.getElementsByClassName("carrito-item-cantidad")[0].value;
        carrito.push({ titulo, precio, cantidad });
    }
    return carrito;
}