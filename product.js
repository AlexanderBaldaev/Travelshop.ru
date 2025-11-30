


const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

let currentQuantity = 1;

function loadProductDetails() {
    const product = extendedProducts.find(p => p.id === productId);

    if (!product) {
        document.getElementById('productDetail').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <h2>Товар не найден</h2>
                <p style="margin: 20px 0; color: var(--text-light);">К сожалению, запрашиваемый товар не существует.</p>
                <a href="catalog.html" class="btn btn-black">Вернуться в каталог</a>
            </div>
        `;
        return;
    }

    document.title = `${product.name} - TravelShop`;

    document.getElementById('productDetail').innerHTML = `
        <div class="product-image-large">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info-large">
            <p class="product-category">${product.categoryName}</p>
            <h1 class="product-title">${product.name}</h1>
            <p class="product-price-large">${product.price.toLocaleString('ru-RU')} ₽</p>
            <p class="product-description-large">${product.description}</p>

            <div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Характеристики:</h3>
                <ul class="product-features">
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div class="quantity-selector">
                <span style="font-size: 14px; color: var(--text-light);">Количество:</span>
                <div class="quantity-controls">
                    <button class="quantity-btn" id="decreaseQty">−</button>
                    <span class="quantity-value" id="quantityValue">1</span>
                    <button class="quantity-btn" id="increaseQty">+</button>
                </div>
            </div>

            <button class="btn btn-black add-to-cart-large" id="addToCartBtn">Добавить в корзину</button>
        </div>
    `;

    document.getElementById('decreaseQty').addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            document.getElementById('quantityValue').textContent = currentQuantity;
        }
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
        currentQuantity++;
        document.getElementById('quantityValue').textContent = currentQuantity;
    });

    document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(product, currentQuantity);

        const btn = document.getElementById('addToCartBtn');
        const originalText = btn.textContent;
        btn.textContent = `✓ Добавлено ${currentQuantity} шт.`;
        btn.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            currentQuantity = 1;
            document.getElementById('quantityValue').textContent = currentQuantity;
        }, 2000);
    });

    loadRelatedProducts(product.category, product.id);
}

function loadRelatedProducts(category, currentProductId) {
    const related = allProducts.filter(p => p.category === category && p.id !== currentProductId).slice(0, 4);

    if (related.length === 0) {
        document.getElementById('relatedProducts').innerHTML = '<p style="text-align: center; color: var(--text-light);">Нет похожих товаров</p>';
        return;
    }

    document.getElementById('relatedProducts').innerHTML = related.map(product => `
        <div class="product-card-minimal" style="cursor: pointer;" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="product-image-minimal">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info-minimal">
                <h3 class="product-name-minimal">${product.name}</h3>
                <p class="product-price-minimal">${product.price.toLocaleString('ru-RU')} ₽</p>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});
