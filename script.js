const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}




document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = e.target.closest('.product-card-minimal');
        if (card) {
            const productName = card.querySelector('.product-name-minimal')?.textContent;
            const productPrice = card.querySelector('.product-price-minimal')?.textContent;
            const productImage = card.querySelector('.product-image-minimal img')?.src;

            if (productName && productPrice && productImage) {
                const price = parseInt(productPrice.replace(/[^\d]/g, ''));
                const product = { name: productName, price: price, image: productImage };

                addToCart(product);

                
                e.target.textContent = '✓ Добавлено';
                e.target.style.backgroundColor = '#000';
                e.target.style.color = '#fff';

                setTimeout(() => {
                    e.target.textContent = 'В корзину';
                    e.target.style.backgroundColor = '';
                    e.target.style.color = '';
                }, 1000);
            }
        }
    });
});


document.querySelectorAll('.product-card-minimal').forEach(card => {
    card.addEventListener('click', (e) => {
        
        if (!e.target.classList.contains('btn-add-cart')) {
            const productId = card.getAttribute('data-product-id');
            if (productId) {
                window.location.href = `product.html?id=${productId}`;
            }
        }
    });
});




const searchBtn = document.getElementById('searchBtn');
const searchInput = document.querySelector('.search-input');
const searchIconBtn = document.querySelector('.search-icon-btn');
const headerSearchInput = document.getElementById('headerSearchInput');
const searchContainer = document.querySelector('.search-container');


const searchProducts = [
    { id: 1, name: 'Рюкзак туристический 50л', price: 4990, image: 'img/рюкзак.jpg' },
    { id: 2, name: 'Палатка 3-местная', price: 8490, image: 'img/палатка.jpg' },
    { id: 3, name: 'Спальник -5°C', price: 3290, image: 'img/спальник.jpg' },
    { id: 4, name: 'Треккинговые ботинки', price: 6990, image: 'img/ботинки.jpg' },
    { id: 5, name: 'Фонарь LED', price: 1990, image: 'img/лампа.jpg' },
    { id: 6, name: 'Экипировка', price: 15490, image: 'img/Экипировка.jpg' },
    { id: 7, name: 'Коврик для сна', price: 2290, image: 'img/Коврик.jpg' },
    { id: 8, name: 'Термос 1л', price: 1790, image: 'img/Чай в горах.jpg' },
    { id: 9, name: 'Теплые перчатки', price: 990, image: 'img/Перчатки.jpg' },
    { id: 10, name: 'Походная аптечка', price: 1490, image: 'img/Аптечка.jpg' },
    { id: 11, name: 'GPS-навигатор', price: 12990, image: 'img/Экипировка.jpg' },
    { id: 12, name: 'Компас туристический', price: 890, image: 'img/ко.jpg' }
];


if (searchBtn && searchContainer) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = searchContainer.classList.contains('active');

        if (!isActive) {
            
            searchContainer.classList.add('active');
            if (headerSearchInput) {
                headerSearchInput.focus();
            }
        } else {
            
            if (headerSearchInput && headerSearchInput.value.trim()) {
                performHeaderSearch(headerSearchInput.value.trim());
            } else {
                
                searchContainer.classList.remove('active');
            }
        }
    });
}


if (headerSearchInput) {
    headerSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = headerSearchInput.value.trim();
            if (query) {
                performHeaderSearch(query);
            }
        }
    });

    
    document.addEventListener('click', (e) => {
        if (searchContainer && !searchContainer.contains(e.target)) {
            searchContainer.classList.remove('active');
        }
    });
}


const mainSearchInput = document.getElementById('mainSearchInput');
const mainSearchBtn = document.getElementById('mainSearchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');

if (mainSearchInput && searchSuggestions) {
    
    mainSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 1) {
            searchSuggestions.classList.remove('active');
            return;
        }
        
        const filteredProducts = searchProducts.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        
        if (filteredProducts.length > 0) {
            searchSuggestions.innerHTML = filteredProducts.map(product => `
                <a href="product.html?id=${product.id}" class="search-suggestion-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-suggestion-info">
                        <div class="search-suggestion-name">${product.name}</div>
                        <div class="search-suggestion-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    </div>
                </a>
            `).join('');
            searchSuggestions.classList.add('active');
        } else {
            searchSuggestions.innerHTML = '<div class="search-no-results">Товары не найдены</div>';
            searchSuggestions.classList.add('active');
        }
    });
    
    
    mainSearchInput.addEventListener('focus', () => {
        if (mainSearchInput.value.trim().length > 0) {
            searchSuggestions.classList.add('active');
        }
    });
    
    
    document.addEventListener('click', (e) => {
        if (!mainSearchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('active');
        }
    });
    
    
    mainSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = mainSearchInput.value.trim();
            if (query) {
                sessionStorage.setItem('searchQuery', query);
                window.location.href = 'catalog.html';
            }
        }
    });
}


if (mainSearchBtn) {
    mainSearchBtn.addEventListener('click', () => {
        const query = mainSearchInput?.value.trim();
        if (query) {
            sessionStorage.setItem('searchQuery', query);
            window.location.href = 'catalog.html';
        }
    });
}


if (searchBtn && !searchContainer) {
    searchBtn.addEventListener('click', () => {
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 500);
        }
    });
}

if (searchIconBtn && !mainSearchBtn) {
    searchIconBtn.addEventListener('click', () => {
        performSearch();
    });
}

if (searchInput && !mainSearchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}


function performHeaderSearch(query) {
    if (!query) return;

    
    sessionStorage.setItem('searchQuery', query);

    
    window.location.href = 'catalog.html';
}


function performSearch() {
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) return;

    
    const products = document.querySelectorAll('.product-card-minimal, .category-card-large, .best-card');
    products.forEach(product => {
        const text = product.textContent.toLowerCase();
        if (text.includes(query)) {
            product.style.border = '2px solid #000';
            product.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            product.style.opacity = '0.3';
        }
    });

    
    setTimeout(() => {
        products.forEach(product => {
            product.style.border = '';
            product.style.opacity = '';
        });
        if (searchInput) {
            searchInput.value = '';
        }
    }, 3000);
}


document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const searchText = tag.getAttribute('data-search') || tag.textContent.trim();
        
        
        if (mainSearchInput) {
            mainSearchInput.value = searchText;
            sessionStorage.setItem('searchQuery', searchText);
            window.location.href = 'catalog.html';
        } else if (searchInput) {
            searchInput.value = searchText.toLowerCase();
            performSearch();
        }
    });
});


const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('.newsletter-input');
        const email = emailInput?.value.trim();
        
        if (email && email.includes('@')) {
            alert('Спасибо за подписку! Мы отправим вам лучшие предложения на ' + email);
            if (emailInput) {
                emailInput.value = '';
            }
        } else {
            alert('Пожалуйста, введите корректный email адрес');
        }
    });
}


class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.pagination-dot');
        this.prevBtn = document.getElementById('sliderPrev');
        this.nextBtn = document.getElementById('sliderNext');
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; 
        this.isAnimating = false;

        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.showSlide(0);
        this.bindEvents();
        this.startAutoPlay();
    }

    bindEvents() {
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.prevSlide();
                    this.resetAutoPlay();
                }
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.nextSlide();
                    this.resetAutoPlay();
                }
            });
        }

        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isAnimating && index !== this.currentSlide) {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                }
            });
        });

        
        const sliderWrapper = document.querySelector('.hero-slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
            sliderWrapper.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        
        document.addEventListener('keydown', (e) => {
            if (!this.isAnimating) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.resetAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.resetAutoPlay();
                }
            }
        });

        
        let touchStartX = 0;
        let touchEndX = 0;
        const slider = document.querySelector('.hero-slider');
        
        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold && !this.isAnimating) {
            if (diff > 0) {
                
                this.nextSlide();
            } else {
                
                this.prevSlide();
            }
            this.resetAutoPlay();
        }
    }

    showSlide(index) {
        this.isAnimating = true;

        
        this.slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        this.currentSlide = index;

        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slideCount;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        this.stopAutoPlay(); 
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hero-slider')) {
        new HeroSlider();
    }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            if (nav) {
                nav.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        }
    });
});


let scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #000;
    color: white;
    border: 1px solid #000;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.backgroundColor = 'transparent';
    scrollTopBtn.style.color = '#000';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.backgroundColor = '#000';
    scrollTopBtn.style.color = 'white';
});




document.querySelectorAll('.category-card-large, .best-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
