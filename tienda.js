const db = firebase.firestore();
let cart = [];
let allProducts = [];

// Cargar productos
db.collection("products").onSnapshot(snapshot => {
    allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProducts(allProducts);
});

function getPriceTier(qty, prod) {
    if (qty >= 500) return prod.price500;
    if (qty >= 200) return prod.price200_499;
    if (qty >= 100) return prod.price100_199;
    if (qty >= 50) return prod.price50_99;
    if (qty >= 10) return prod.price10_49;
    return prod.price1_9;
}

function addToCart(productId) {
    const qty = parseInt(document.getElementById(`qty-${productId}`).value);
    const prod = allProducts.find(p => p.id === productId);
    const unitPrice = getPriceTier(qty, prod);
    
    cart.push({ ...prod, quantity: qty, price: unitPrice });
    document.getElementById('cartCount').innerText = cart.length;
    alert("Agregado al carrito");
}

function finalizePurchase() {
    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const payment = document.getElementById('paymentMethod').value;
    const delivery = document.getElementById('deliveryMethod').value;
    
    let total = subtotal;
    if (payment === 'mercadopago') total *= 1.06;

    // Guardar en Firestore
    db.collection("orders").add({
        cart,
        total,
        payment,
        delivery,
        date: new Date(),
        status: 'Pendiente'
    }).then(() => {
        // Generar Comprobante
        generateReceipt(total, payment, delivery);
    });
}

function generateReceipt(total, payment, delivery) {
    const win = window.open('', '_blank');
    win.document.write(`
        <h2>LT TECNO - Comprobante</h2>
        <p>Total: $${total.toFixed(2)}</p>
        <p>Método: ${payment}</p>
        <p>Envío: ${delivery}</p>
        <button onclick="window.print()">Imprimir</button>
    `);
}
