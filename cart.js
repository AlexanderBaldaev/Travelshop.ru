let cart = [];
let cartCount = 0;

const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');

function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartCount();
    }
}

function addToCart(product, quantity = 1) {
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    cartCount += quantity;
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

function updateCartDisplay() {
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        const totalSpan = cartTotal.querySelector('span');
        if (totalSpan) totalSpan.textContent = '0 ₽';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 0.25rem; font-size: 0.9rem;">${item.name}</h4>
                    <p style="color: #666; font-size: 0.85rem;">${item.price.toLocaleString('ru-RU')} ₽ × ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">${itemTotal.toLocaleString('ru-RU')} ₽</p>
                    <button class="remove-item" data-name="${item.name}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem;">Удалить</button>
                </div>
            </div>
        `;
    }).join('');

    const totalSpan = cartTotal.querySelector('span');
    if (totalSpan) totalSpan.textContent = `${total.toLocaleString('ru-RU')} ₽`;

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productName = e.target.getAttribute('data-name');
            removeFromCart(productName);
        });
    });
}

function removeFromCart(productName) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        cartCount -= item.quantity;
        cart = cart.filter(item => item.name !== productName);
        updateCartCount();
        updateCartDisplay();
    }
}

function initCartModal() {
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            updateCartDisplay();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.href = 'checkout.html';
            } else {
                alert('Корзина пуста. Добавьте товары для оформления заказа.');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initCartModal();
    initCheckout();
});
