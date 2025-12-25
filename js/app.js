// بيانات المنتجات (يتم تحميلها من localStorage)
let products = JSON.parse(localStorage.getItem('hakim_products')) || [];
let cart = JSON.parse(localStorage.getItem('hakim_cart')) || [];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // تحميل المنتجات إذا لم تكن موجودة
    if (products.length === 0) {
        loadSampleProducts();
    }
    
    // تحميل واجهة المستخدم
    loadProducts();
    updateCartCount();
    setupEventListeners();
}

function loadSampleProducts() {
    products = [
        {
            id: 1,
            name: "فلتر زيت تويوتا كورولا",
            description: "فلتر زيت أصلي لتويوتا كورولا 2015-2020",
            price: 45.00,
            image: "https://images.unsplash.com/photo-1563720223486-32942674519f?w=500",
            category: "engine",
            brand: "toyota",
            stock: 50,
            featured: true,
            tags: ["new", "bestseller"]
        },
        {
            id: 2,
            name: "بطارية سيارة 65 أمبير",
            description: "بطارية سيارة عالية الجودة 65 أمبير مع ضمان سنتين",
            price: 350.00,
            image: "https://images.unsplash.com/photo-1563720223486-32942674519f?w=500",
            category: "electrical",
            brand: "hyundai",
            stock: 30,
            featured: true,
            tags: ["sale"]
        },
        {
            id: 3,
            name: "قرص فرامل أمامي",
            description: "قرص فرامل أمامي لنيسان صني 2018",
            price: 120.00,
            image: "https://images.unsplash.com/photo-1563720223486-32942674519f?w=500",
            category: "brakes",
            brand: "nissan",
            stock: 25,
            featured: false,
            tags: ["new"]
        }
    ];
    
    localStorage.setItem('hakim_products', JSON.stringify(products));
}

function loadProducts(filter = 'all') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    let filteredProducts = products;
    
    if (filter === 'featured') {
        filteredProducts = products.filter(p => p.featured);
    } else if (filter === 'new') {
        filteredProducts = products.filter(p => p.tags?.includes('new'));
    } else if (filter === 'sale') {
        filteredProducts = products.filter(p => p.tags?.includes('sale'));
    }
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>لا توجد منتجات</h3>
                <p>لم يتم العثور على منتجات مطابقة للبحث</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // إنشاء البادجات
    let badges = '';
    if (product.tags?.includes('new')) {
        badges += '<span class="product-badge badge-new">جديد</span>';
    }
    if (product.tags?.includes('sale')) {
        badges += '<span class="product-badge badge-sale">خصم</span>';
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${badges}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price.toFixed(2)} ر.س</div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> أضف للسلة
                </button>
                <button class="btn btn-outline view-details-btn" data-id="${product.id}">
                    <i class="fas fa-eye"></i> تفاصيل
                </button>
            </div>
            <div class="product-meta">
                <span><i class="fas fa-tag"></i> ${getCategoryName(product.category)}</span>
                <span><i class="fas fa-car"></i> ${getBrandName(product.brand)}</span>
            </div>
        </div>
    `;
    
    return card;
}

function getCategoryName(category) {
    const categories = {
        'engine': 'محرك',
        'brakes': 'فرامل',
        'electrical': 'كهرباء',
        'suspension': 'تعليق',
        'body': 'هيكل',
        'maintenance': 'صيانة'
    };
    return categories[category] || category;
}

function getBrandName(brand) {
    const brands = {
        'toyota': 'تويوتا',
        'nissan': 'نيسان',
        'hyundai': 'هيونداي',
        'kia': 'كيا',
        'bmw': 'بي إم دبليو',
        'mercedes': 'مرسيدس',
        'chevrolet': 'شفرولية',
        'ford': 'فورد'
    };
    return brands[brand] || brand;
}

function setupEventListeners() {
    // القائمة المتنقلة للموبايل
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMobileNav = document.querySelector('.close-mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNav = document.querySelector('.mobile-nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMobileNav.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    mobileNavOverlay.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // القوائم المنسدلة في الموبايل
    document.querySelectorAll('.has-submenu').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
    });
    
    // أزرار الفلترة
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            loadProducts(this.dataset.filter);
        });
    });
    
    // أزرار التصنيفات
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // أزرار الماركات
    document.querySelectorAll('.brand-logo').forEach(logo => {
        logo.addEventListener('click', function() {
            const brand = this.dataset.brand;
            filterByBrand(brand);
        });
    });
    
    // الروابط في الفوتر
    document.querySelectorAll('a[data-category], a[data-brand]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.dataset.category) {
                filterByCategory(this.dataset.category);
            } else if (this.dataset.brand) {
                filterByBrand(this.dataset.brand);
            }
        });
    });
    
    // التنقل السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function filterByCategory(category) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    const filteredProducts = products.filter(p => p.category === category);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>لا توجد منتجات في هذا القسم</h3>
                <p>سيتم إضافة منتجات قريباً</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // تحديث أزرار الفلترة
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // التمرير للقسم
    const productsSection = document.getElementById('products');
    if (productsSection) {
        window.scrollTo({
            top: productsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

function filterByBrand(brand) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    const filteredProducts = products.filter(p => p.brand === brand);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>لا توجد منتجات لهذه الماركة</h3>
                <p>سيتم إضافة منتجات قريباً</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // تحديث أزرار الفلترة
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // التمرير للقسم
    const productsSection = document.getElementById('products');
    if (productsSection) {
        window.scrollTo({
            top: productsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

// إضافة معالجات الأحداث للمنتجات (يتم إضافتها بعد إنشاء البطاقات)
function setupProductEvents() {
    // إضافة للسلة
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
    
    // عرض التفاصيل
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            showProductDetails(productId);
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            alert('الكمية المطلوبة غير متوفرة في المخزون');
            return;
        }
    } else {
        if (product.stock > 0) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        } else {
            alert('المنتج غير متوفر حالياً');
            return;
        }
    }
    
    localStorage.setItem('hakim_cart', JSON.stringify(cart));
    updateCartCount();
    
    // عرض إشعار
    showNotification('تم إضافة المنتج إلى السلة');
}

function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // إضافة التنسيق
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="modal-price">${product.price.toFixed(2)} ر.س</div>
            <div class="modal-description">
                <p>${product.description}</p>
            </div>
            <div class="modal-details">
                <div class="detail-item">
                    <span class="detail-label">القسم:</span>
                    <span>${getCategoryName(product.category)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الماركة:</span>
                    <span>${getBrandName(product.brand)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">المخزون:</span>
                    <span>${product.stock} قطعة</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> أضف إلى السلة
                </button>
                <button class="btn btn-outline close-modal-btn">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    // فتح النافذة
    document.querySelector('.product-modal-overlay').classList.add('active');
    document.querySelector('.product-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // إضافة الأحداث
    modalBody.querySelector('.add-to-cart-modal').addEventListener('click', function() {
        addToCart(productId);
    });
    
    modalBody.querySelector('.close-modal-btn').addEventListener('click', closeProductModal);
}

function closeProductModal() {
    document.querySelector('.product-modal-overlay').classList.remove('active');
    document.querySelector('.product-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// إغلاق النافذة عند النقر خارجها
document.querySelector('.product-modal-overlay').addEventListener('click', closeProductModal);
document.querySelector('.close-modal').addEventListener('click', closeProductModal);

// تحديث عرض السلة
function updateCartDisplay() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsList = document.getElementById('cartItemsList');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsList.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItemsList.style.display = 'block';
    
    cartItemsList.innerHTML = '';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${item.price.toFixed(2)} ر.س</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${product.stock}" data-id="${item.id}">
                        <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
        
        cartItemsList.appendChild(cartItem);
    });
    
    // تحديث الملخص
    updateCartSummary();
    
    // إضافة الأحداث للعناصر الجديدة
    setupCartEvents();
}

function updateCartSummary() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 25.00;
    const total = subtotal + shipping;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' ر.س';
    document.getElementById('shipping').textContent = shipping.toFixed(2) + ' ر.س';
    document.getElementById('totalPrice').textContent = total.toFixed(2) + ' ر.س';
}

function setupCartEvents() {
    // زيادة الكمية
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            updateCartQuantity(productId, 1);
        });
    });
    
    // تقليل الكمية
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            updateCartQuantity(productId, -1);
        });
    });
    
    // تغيير الكمية يدوياً
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            const newQuantity = parseInt(this.value);
            
            if (newQuantity >= 1) {
                const product = products.find(p => p.id === productId);
                if (product && newQuantity <= product.stock) {
                    setCartQuantity(productId, newQuantity);
                } else {
                    alert('الكمية المطلوبة غير متوفرة');
                    this.value = cart.find(item => item.id === productId).quantity;
                }
            } else {
                this.value = 1;
            }
        });
    });
    
    // حذف العنصر
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
    
    // إتمام الشراء
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('السلة فارغة! أضف منتجات أولاً.');
            return;
        }
        
        if (confirm('هل تريد إتمام عملية الشراء؟')) {
            alert('تم إتمام عملية الشراء بنجاح! شكراً لثقتك بمتجر Hakim Auto Pieces.');
            cart = [];
            localStorage.setItem('hakim_cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    });
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        alert('الكمية المطلوبة غير متوفرة في المخزون');
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('hakim_cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function setCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (quantity > product.stock) {
        alert('الكمية المطلوبة غير متوفرة في المخزون');
        return;
    }
    
    item.quantity = quantity;
    localStorage.setItem('hakim_cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId) {
    if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('hakim_cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        
        showNotification('تم حذف المنتج من السلة');
    }
}

// تحديث عرض السلة عند التبديل للصفحة
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateCartCount();
    }
});

// إضافة هذا السطر في نهاية initApp لتحميل المنتجات مع الأحداث
function initApp() {
    if (products.length === 0) {
        loadSampleProducts();
    }
    
    loadProducts();
    updateCartCount();
    setupEventListeners();
    setupProductEvents(); // أضف هذا السطر
}
