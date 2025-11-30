let currentProducts = [...allProducts];

function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');

    if (productsCount) {
        const count = products ? products.length : 0;
        const word = getProductWord(count);
        productsCount.textContent = `${count} ${word}`;
    }

    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products"><div class="no-products-icon">🔍</div><p>Товары не найдены</p><p style="font-size:14px;margin-top:8px">Попробуйте изменить параметры фильтрации</p></div>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card-catalog" data-product-id="${product.id}" data-category="${product.category}">
            <div class="product-image-catalog">
                <img src="${product.image}" alt="${product.name}">
                <button class="product-wishlist" title="В избранное">♡</button>
                ${product.price > 5000 ? '<span class="product-badge">Хит</span>' : ''}
            </div>
            <div class="product-info-catalog">
                <div class="product-category-tag">${categoryLabels[product.category] || product.category}</div>
                <h3 class="product-name-catalog">${product.name}</h3>
                <p class="product-description-catalog">${product.description}</p>
                <div class="product-footer-catalog">
                    <span class="product-price-catalog">${product.price.toLocaleString('ru-RU')} <small>₽</small></span>
                    <button class="btn-add-catalog">В корзину</button>
                </div>
            </div>
        </div>
    `).join('');

    attachProductEventListeners();
}

function getProductWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'товаров';
    if (lastDigit === 1) return 'товар';
    if (lastDigit >= 2 && lastDigit <= 4) return 'товара';
    return 'товаров';
}

function attachProductEventListeners() {
    document.querySelectorAll('.btn-add-catalog').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = e.target.closest('.product-card-catalog');
            if (card) {
                const productId = parseInt(card.getAttribute('data-product-id'));
                const product = allProducts.find(p => p.id === productId);

                if (product) {
                    addToCart(product);

                    e.target.textContent = '✓ Добавлено';
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

                    setTimeout(() => {
                        e.target.textContent = 'В корзину';
                        e.target.style.background = '';
                    }, 1500);
                }
            }
        });
    });

    document.querySelectorAll('.product-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isFilled = button.textContent === '♥';
            button.textContent = isFilled ? '♡' : '♥';
            button.style.color = isFilled ? '' : '#ff4757';
            button.style.background = isFilled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 71, 87, 0.1)';
        });
    });

    document.querySelectorAll('.product-card-catalog').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-add-catalog') && !e.target.classList.contains('product-wishlist')) {
                const productId = card.getAttribute('data-product-id');
                if (productId) {
                    window.location.href = `product.html?id=${productId}`;
                }
            }
        });
    });
}

function applyFilters() {
    let filtered = [...allProducts];

    const categoryCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]:checked');
    if (categoryCheckboxes.length > 0) {
        const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
        filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;
    filtered = filtered.filter(product => product.price >= priceMin && product.price <= priceMax);

    currentProducts = filtered;
    applySorting();
}

function applySorting() {
    const sortValue = document.getElementById('sortSelect').value;
    let sorted = [...currentProducts];

    switch (sortValue) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
            break;
        default:
            break;
    }

    renderProducts(sorted);
}

function resetFilters() {
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('sortSelect').value = 'default';

    currentProducts = [...allProducts];
    renderProducts(currentProducts);
}

document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);
document.getElementById('sortSelect').addEventListener('change', applySorting);

const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const productsGrid = document.getElementById('productsGrid');

if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', () => {
        productsGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        productsGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });
}

const mobileFiltersToggle = document.getElementById('mobileFiltersToggle');
const filtersSidebar = document.getElementById('filtersSidebar');

if (mobileFiltersToggle && filtersSidebar) {
    mobileFiltersToggle.addEventListener('click', () => {
        filtersSidebar.classList.toggle('active');
        const isActive = filtersSidebar.classList.contains('active');
        mobileFiltersToggle.innerHTML = isActive ? '<span>✕</span> Скрыть фильтры' : '<span>⚙️</span> Фильтры';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchQuery = sessionStorage.getItem('searchQuery');
    if (searchQuery) {
        sessionStorage.removeItem('searchQuery');

        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        currentProducts = filteredProducts;
        renderProducts(filteredProducts);

        const catalogTitle = document.querySelector('.catalog-title');
        if (catalogTitle) {
            catalogTitle.textContent = `Результаты поиска: "${searchQuery}"`;
        }
    } else {
        renderProducts(allProducts);
    }
});

