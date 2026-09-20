// Simulación de base de datos
let productos = [
    { id: 1, nombre: "Producto A", precio1_9: 100, price10_49: 90, stock: 50 },
    // ... aquí irían tus productos
];

// Cálculo de precio según cantidad (Lógica de Ventas por Mayor)
function getPriceForQuantity(producto, cantidad) {
    if (cantidad >= 500) return producto.price500;
    if (cantidad >= 200) return producto.price200_499;
    if (cantidad >= 100) return producto.price100_199;
    if (cantidad >= 50) return producto.price50_99;
    if (cantidad >= 10) return producto.price10_49;
    return producto.price1_9;
}

// Lógica de Carrito
let cart = [];

function addToCart(productId, quantity) {
    const product = productos.find(p => p.id === productId);
    const unitPrice = getPriceForQuantity(product, quantity);
    cart.push({ ...product, quantity, subtotal: unitPrice * quantity });
    alert("Producto agregado");
}

// Proceso de Pago
function processCheckout(method) {
    let total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    
    if (method === 'mercadopago') {
        total = total * 1.06; // Recargo del 6%
        window.open('https://link.mercadopago.com.ar/lttecno', '_blank');
    }
    
    generateReceipt(total, method);
}

// Generar comprobante simple
function generateReceipt(total, method) {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
        <h1>LT TECNO - Comprobante</h1>
        <p>Método de pago: ${method}</p>
        <p>Total: $${total.toFixed(2)}</p>
        <button onclick="window.print()">Imprimir</button>
    `);
}
