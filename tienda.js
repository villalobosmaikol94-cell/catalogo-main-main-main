let carrito = [];

function alternarCarrito() {
    const carritoLateral = document.getElementById('carrito-lateral');
    if (carritoLateral) {
        if (carritoLateral.classList.contains('carrito-cerrado')) {
            carritoLateral.classList.remove('carrito-cerrado');
            carritoLateral.classList.add('carrito-abierto');
        } else {
            carritoLateral.classList.remove('carrito-abierto');
            carritoLateral.classList.add('carrito-cerrado');
        }
    }
}

// INTERACTIVIDAD PARA BOTONES DE TALLAS Y COLORES
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-talla')) {
        const grupo = e.target.closest('.grupo-tallas');
        if (grupo) {
            grupo.querySelectorAll('.btn-talla').forEach(btn => btn.classList.remove('seleccionada'));
            e.target.classList.add('seleccionada');
        }
    }
        if (e.target && e.target.classList.contains('btn-color-texto')) {
        const grupo = e.target.closest('.grupo-colores');
        if (grupo) {
            grupo.querySelectorAll('.btn-color-texto').forEach(btn => btn.classList.remove('seleccionada'));
            e.target.classList.add('seleccionada');
        }
    }

});

// AGREGAR PRODUCTOS AL CARRITO CON COLOR
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-agregar-carrito')) {
        const boton = e.target;
        const tarjeta = boton.closest('.tarjeta-producto');
        if (!tarjeta) return;

        const nombre = tarjeta.querySelector('.nombre-prod') ? tarjeta.querySelector('.nombre-prod').innerText : tarjeta.querySelector('h3').innerText;
        const precioTexto = tarjeta.querySelector('.precio').getAttribute('data-precio') || tarjeta.querySelector('.precio').innerText;
        
        const botonTalla = tarjeta.querySelector('.btn-talla.seleccionada');
        const talla = botonTalla ? botonTalla.getAttribute('data-talla') : null;

        const botonColor = tarjeta.querySelector('.btn-color-texto.seleccionada');
        const color = botonColor ? botonColor.getAttribute('data-color') : null;

        const precioNumero = parseInt(precioTexto.replace(/[^0-9]/g, ''));

        const producto = {
            nombre: nombre,
            talla: talla,
            color: color,
            precioTexto: precioTexto,
            precioNumero: precioNumero
        };

        carrito.push(producto);
        actualizarInterfazCarrito();

        const carritoLateral = document.getElementById('carrito-lateral');
        if (carritoLateral && carritoLateral.classList.contains('carrito-cerrado')) {
            alternarCarrito();
        }
    }
});

function actualizarInterfazCarrito() {
    const contenedorItems = document.getElementById('items-carrito');
    const contador = document.getElementById('contador-carrito');
    const contenedorTotal = document.getElementById('precio-total-carrito');

    if (!contenedorItems || !contador || !contenedorTotal) return;
    contenedorItems.innerHTML = '';
    let totalSuma = 0;

    carrito.forEach((item, index) => {
        totalSuma += item.precioNumero;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-en-carrito');
        
        let detalles = '';
        if (item.color) detalles += `Color: ${item.color}`;
        if (item.talla) detalles += detalles ? `, Talla: ${item.talla}` : `Talla: ${item.talla}`;
        const textoDetalles = detalles ? ` (${detalles})` : '';

        itemDiv.innerHTML = `
            <div class="info-item-carrito">
                <h4>${item.nombre}${textoDetalles}</h4>
                <p>${item.precioTexto}</p>
            </div>
            <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${index})">❌</button>
        `;
        contenedorItems.appendChild(itemDiv);
    });

    contador.innerText = carrito.length;
    contenedorTotal.innerText = `$${totalSuma.toLocaleString('es-CO')} COP`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarInterfazCarrito();
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let numeroTelefono = "573246670248"; 
    let mensaje = `Hola JADARA, quiero realizar el siguiente pedido:\n\n`;

    carrito.forEach((item, index) => {
        let detalles = '';
        if (item.color) detalles += ` - Color: ${item.color}`;
        if (item.talla) detalles += ` - Talla: ${item.talla}`;
        mensaje += `${index + 1}. *${item.nombre}*${detalles} (${item.precioTexto})\n`;
    });

    const contenedorTotal = document.getElementById('precio-total-carrito').innerText;
    mensaje += `\n💰 *Total del Pedido:* ${contenedorTotal}`;

  const urlWhatsApp = "https://wa.me" + "/" + numeroTelefono + "?text=" + encodeURIComponent(mensaje);


 window.open(urlWhatsApp, '_blank');
}

// ZOOM
document.addEventListener('click', function(e) {
    if (e.target && e.target.tagName === 'IMG' && e.target.closest('.tarjeta-producto')) {
        const modal = document.getElementById('modal-zoom');
        const imagenAmpliada = document.getElementById('imagen-ampliada');
        if (modal && imagenAmpliada) {
            modal.style.display = "block";
            imagenAmpliada.src = e.target.src;
        }
    }
    if (e.target && (e.target.classList.contains('cerrar-modal') || e.target.id === 'modal-zoom')) {
        const modal = document.getElementById('modal-zoom');
        if (modal) modal.style.display = "none";
    }
});
