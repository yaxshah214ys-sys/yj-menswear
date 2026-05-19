// Firebase SDKs (Compat version for easier integration)
// Note: These will be loaded in the HTML files via <script> tags for better compatibility.

const firebaseConfig = {
  apiKey: "AIzaSyDpQRrmfk3BK_tzDE7wnXNwLndAcPFVwec",
  authDomain: "yj-menswear.firebaseapp.com",
  databaseURL: "https://yj-menswear-default-rtdb.firebaseio.com/",
  projectId: "yj-menswear",
  storageBucket: "yj-menswear.firebasestorage.app",
  messagingSenderId: "797580799898",
  appId: "1:797580799898:web:d5dfcc4be480923c94d423",
  measurementId: "G-2D5BKTJR9S"
};

// Global Firebase Instance
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}

const db = typeof firebase !== 'undefined' ? firebase.database() : null;

// Firebase Helpers
async function syncData(key, value) {
    if (db) {
        await db.ref(key).set(value);
    }
}

async function getData(key) {
    if (db) {
        const snapshot = await db.ref(key).once('value');
        return snapshot.val();
    }
    return null;
}

// Authentication Guard
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function handlePurchase(e, redirectUrl) {
    if (!isLoggedIn()) {
        e.preventDefault();
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }
}

// Global Auth Check for Protected Pages (Dashboard and Account only)
document.querySelectorAll('a[href*="dashboard-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        handlePurchase(e, btn.getAttribute('href'));
    });
});

// Toast Notification System
function showToast(message) {
    // Remove existing toast if any
    const existing = document.getElementById('yj-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'yj-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: #000;
        padding: 12px 25px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px var(--primary);
        z-index: 9999;
        animation: slideUpFade 0.5s ease forwards;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDownFade 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Add these animations
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes slideUpFade {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideDownFade {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, 20px); }
    }
`;
document.head.appendChild(styleSheet);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Search Logic
document.addEventListener('DOMContentLoaded', () => {
    const globalSearch = document.getElementById('globalSearch');
    const pageSearch = document.getElementById('pageSearch');

    if (globalSearch) {
        // Create results container
        const searchWrapper = globalSearch.parentElement;
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'searchSuggestions';
        resultsDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #1a1a1a;
            border: 1px solid var(--glass);
            border-top: none;
            border-radius: 0 0 12px 12px;
            z-index: 1000;
            display: none;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        searchWrapper.style.position = 'relative';
        searchWrapper.appendChild(resultsDiv);

        globalSearch.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                resultsDiv.style.display = 'none';
                return;
            }

            // Get products from Cloud Inventory + Common items
            const cloudProducts = await getData('inventory') || [];
            const staticProducts = [
                { name: 'Leather Wallet', url: 'wallets.html' },
                { name: 'Premium Watch', url: 'watches.html' },
                { name: 'Classic Belt', url: 'belts.html' },
                { name: 'Luxury Perfume', url: 'perfumes.html' },
                { name: 'Aviator Sunglasses', url: 'sunglasses.html' }
            ];

            const allProds = [...staticProducts, ...cloudProducts];
            const matches = allProds.filter(p => p.name.toLowerCase().includes(query)).slice(0, 6);

            if (matches.length > 0) {
                resultsDiv.innerHTML = matches.map(m => `
                    <div class="search-item" style="padding: 12px 20px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); transition: 0.3s;" 
                         onclick="window.location.href='${m.url || (m.category + '.html')}';">
                        <div style="font-weight: 600; font-size: 0.9rem;">${m.name}</div>
                        <div style="font-size: 0.75rem; color: var(--primary); text-transform: capitalize;">${m.category || 'Shop'}</div>
                    </div>
                `).join('');
                
                // Add hover effects
                resultsDiv.querySelectorAll('.search-item').forEach(item => {
                    item.onmouseover = () => item.style.background = 'rgba(255,215,0,0.1)';
                    item.onmouseout = () => item.style.background = 'transparent';
                });

                resultsDiv.style.display = 'block';
            } else {
                resultsDiv.style.display = 'none';
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target)) resultsDiv.style.display = 'none';
        });

        globalSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = globalSearch.value.toLowerCase();
                if (query.includes('wallet')) window.location.href = `wallets.html?search=${query}`;
                else if (query.includes('belt')) window.location.href = `belts.html?search=${query}`;
                else if (query.includes('watch')) window.location.href = `watches.html?search=${query}`;
                else if (query.includes('sunglass')) window.location.href = `sunglasses.html?search=${query}`;
                else window.location.href = `perfumes.html?search=${query}`;
            }
        });
    }

    if (pageSearch) {
        pageSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterProducts(query);
        });

        // Check for search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlQuery = urlParams.get('search');
        if (urlQuery) {
            pageSearch.value = urlQuery;
            filterProducts(urlQuery);
        }
    }

    // Admin Access Check
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.email === 'yashshah2140@gmail.com') {
        const navUl = document.querySelector('nav ul');
        if (navUl && !document.getElementById('adminLink')) {
            const li = document.createElement('li');
            li.id = 'adminLink';
            li.innerHTML = '<a href="admin-users.html" style="color: #ff4757; font-weight: bold;">Admin</a>';
            navUl.appendChild(li);
        }
    }
});

function filterProducts(query) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const name = card.querySelector('.product-name').innerText.toLowerCase();
        const brand = card.querySelector('.product-brand') ? card.querySelector('.product-brand').innerText.toLowerCase() : '';
        if (name.includes(query) || brand.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function togglePassword(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        iconElement.innerText = '👁️‍🗨️';
    } else {
        passwordInput.type = 'password';
        iconElement.innerText = '👁️';
    }
}

// Slider Logic
function setSlide(element, index) {
    const container = element.closest('.slider-container');
    const images = container.querySelectorAll('.slider-img');
    const dots = container.querySelectorAll('.dot');
    
    // Find current active index
    let currentIndex = 0;
    images.forEach((img, i) => {
        if (img.classList.contains('active')) currentIndex = i;
    });

    // Remove active from current
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    // Add active to target
    images[index].classList.add('active');
    dots[index].classList.add('active');
}

// Dynamic Category Loading Logic
async function loadCategoryProducts(category) {
    const grid = document.getElementById('dynamicProductGrid');
    if (!grid) return;

    try {
        if (typeof getData === 'undefined') return;
        const data = await getData('inventory');
        const allProducts = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
        
        // Filter by category
        const categoryProducts = allProducts.filter(p => p.category === category);

        if (categoryProducts.length === 0) {
            // Keep existing static content if no cloud products found
            return;
        }

        // If cloud products exist, we can either append them or replace static ones.
        // Let's prepend them so new items appear first.
        const dynamicHtml = categoryProducts.reverse().map(p => `
            <div class="product-card" onclick="window.location.href='product-detail.html?product=${encodeURIComponent(p.name)}&price=₹${p.price}&originalPrice=₹${p.oldPrice || ''}&imgBase=${p.img.replace('.png', '').replace('.jpg', '')}&ext=${p.img.split('.').pop()}&category=${p.category}'">
                <div class="product-img">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <div class="product-brand" style="text-transform: capitalize;">${p.category}</div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">
                        <span>₹${parseFloat(p.price).toLocaleString('en-IN')}</span>
                        ${p.oldPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem; margin-left: 10px; font-weight: 400;">₹${parseFloat(p.oldPrice).toLocaleString('en-IN')}</span>` : ''}
                    </div>
                    <button class="cta-button" style="width: 100%; margin-top: 15px; font-size: 0.8rem;">View Product</button>
                </div>
            </div>
        `).join('');

        // Clear only if you want to replace static products completely
        // grid.innerHTML = dynamicHtml; 
        
        // Let's prepend to show cloud products at the top
        grid.insertAdjacentHTML('afterbegin', dynamicHtml);

    } catch (e) {
        console.error("Error loading dynamic products", e);
    }
}

// Theme Management
document.addEventListener('DOMContentLoaded', () => {
    // Remove old button if it exists
    const oldBtn = document.querySelector('.theme-toggle-btn');
    if (oldBtn) oldBtn.remove();

    // Prevent multiple injections
    if (!document.querySelector('.theme-switcher-container')) {
        const container = document.createElement('div');
        container.className = 'theme-switcher-container';
        
        // Setup Themes
        const themes = [
            { id: 'dark', colorClass: 'dot-dark' },
            { id: 'light', colorClass: 'dot-light' },
            { id: 'navy', colorClass: 'dot-navy' },
            { id: 'olive', colorClass: 'dot-olive' },
            { id: 'wine', colorClass: 'dot-wine' },
            { id: 'slate', colorClass: 'dot-slate' }
        ];

        let savedTheme = localStorage.getItem('yj_theme') || 'dark';
        if (savedTheme !== 'dark') {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'theme-options';

        const mainBtn = document.createElement('div');
        mainBtn.className = 'main-theme-btn';
        mainBtn.innerHTML = '🎨';
        mainBtn.title = 'Choose Theme';

        themes.forEach(theme => {
            const dot = document.createElement('div');
            dot.className = `theme-dot ${theme.colorClass} ${savedTheme === theme.id ? 'active' : ''}`;
            dot.title = theme.id.charAt(0).toUpperCase() + theme.id.slice(1) + ' Mode';
            
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                // Apply theme
                if (theme.id === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', theme.id);
                }
                localStorage.setItem('yj_theme', theme.id);
                
                // Update active state
                optionsDiv.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Close menu
                container.classList.remove('active');
            });
            optionsDiv.appendChild(dot);
        });

        mainBtn.addEventListener('click', () => {
            container.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove('active');
            }
        });

        container.appendChild(optionsDiv);
        container.appendChild(mainBtn);
        document.body.appendChild(container);
    }
});

// Global Features Injection (Cart Drawer)
document.addEventListener('DOMContentLoaded', () => {
    // Sliding Cart Drawer
    if (!document.querySelector('.cart-drawer')) {
        // Create Overlay
        const overlay = document.createElement('div');
        overlay.className = 'cart-drawer-overlay';
        
        // Create Drawer
        const drawer = document.createElement('div');
        drawer.className = 'cart-drawer';
        drawer.innerHTML = `
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="close-cart">&times;</button>
            </div>
            <div class="cart-items-container" id="drawerCartItems">
                <!-- Items will be injected here -->
            </div>
            <div class="cart-drawer-footer">
                <div class="cart-total-row">
                    <span>Total:</span>
                    <span id="drawerCartTotal">₹0</span>
                </div>
                <a href="checkout.html" class="checkout-btn">Proceed to Checkout</a>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        // Toggle Logic
        const toggleCart = (e) => {
            if(e) e.preventDefault();
            drawer.classList.toggle('active');
            overlay.classList.toggle('active');
            updateDrawerCart(); // Function to refresh items
        };

        // Close on overlay or close btn
        overlay.addEventListener('click', toggleCart);
        drawer.querySelector('.close-cart').addEventListener('click', toggleCart);

        // Intercept Cart Links
        document.querySelectorAll('a[href="cart.html"], a[href="cart.html?"]').forEach(link => {
            link.addEventListener('click', toggleCart);
        });
    }
});

// Function to update the drawer cart from localStorage
function updateDrawerCart() {
    const container = document.getElementById('drawerCartItems');
    const totalEl = document.getElementById('drawerCartTotal');
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem('yj_cart')) || [];
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:50px;">Your cart is empty.</p>';
        totalEl.innerText = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
        total += price * item.qty;
        return `
            <div class="cart-drawer-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                        <span class="price">₹${price.toLocaleString('en-IN')}</span>
                        <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:5px; border:1px solid var(--glass);">
                            <span style="cursor:pointer;" onclick="updateDrawerItemQty(${index}, -1)">-</span>
                            <span>${item.qty}</span>
                            <span style="cursor:pointer;" onclick="updateDrawerItemQty(${index}, 1)">+</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    totalEl.innerText = `₹${total.toLocaleString('en-IN')}`;
}

// Global function to update qty from drawer
window.updateDrawerItemQty = function(index, change) {
    let cart = JSON.parse(localStorage.getItem('yj_cart')) || [];
    if (cart[index]) {
        cart[index].qty += change;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('yj_cart', JSON.stringify(cart));
        updateDrawerCart(); // Refresh
        
        // If on cart page, refresh it too
        if (window.location.pathname.includes('cart.html') && typeof renderCart === 'function') {
            renderCart();
        }
    }
};

// ==========================================
// Quick View Feature Logic
// ==========================================
function injectQuickViewButtons() {
    document.querySelectorAll('.product-img').forEach(imgContainer => {
        if (!imgContainer.querySelector('.quick-view-overlay')) {
            const btn = document.createElement('div');
            btn.className = 'quick-view-overlay';
            btn.innerHTML = '👁️ Quick View';
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevent going to detail page
                const card = imgContainer.closest('.product-card');
                openQuickView(card);
            };
            imgContainer.appendChild(btn);
        }
    });
}

function openQuickView(card) {
    const clickAttr = card.getAttribute('onclick');
    let name = card.querySelector('.product-name')?.innerText || 'Product';
    let price = card.querySelector('.product-price')?.childNodes[0]?.nodeValue.trim() || '₹0';
    let oldPrice = card.querySelector('.product-price span')?.innerText || '';
    let imgSrc = card.querySelector('img').src;

    if (clickAttr) {
        const urlMatch = clickAttr.match(/location\.href='([^']+)'/);
        if (urlMatch) {
            const urlString = urlMatch[1];
            try {
                // Parse params safely without needing full absolute URL context
                const url = new URL(urlString, window.location.origin + window.location.pathname);
                const params = new URLSearchParams(url.search);
                name = params.get('product') || name;
                price = params.get('price') || price;
                oldPrice = params.get('originalPrice') || oldPrice;
                const imgBase = params.get('imgBase');
                const ext = params.get('ext') || 'png';
                if (imgBase) imgSrc = `${imgBase}.${ext}`;
            } catch(e) {}
        }
    }
    
    let modal = document.getElementById('quickViewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
            z-index: 3000; display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
        `;
        modal.innerHTML = `
            <div class="qv-content" style="background: var(--bg-card); width: 90%; max-width: 800px; border-radius: 15px; border: 1px solid var(--glass); display: flex; overflow: hidden; position: relative; transform: scale(0.9); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <button class="qv-close" style="position: absolute; top: 15px; right: 20px; background: rgba(0,0,0,0.1); width:40px; height:40px; border-radius:50%; border: none; font-size: 1.5rem; color: var(--text-main); cursor: pointer; z-index: 10;">&times;</button>
                <div style="flex: 1; background: #fff; display: flex; align-items: center; justify-content: center; padding: 30px;">
                    <img id="qv-img" src="" style="width: 100%; max-height: 350px; object-fit: contain;">
                </div>
                <div style="flex: 1; padding: 40px 30px; display: flex; flex-direction: column; justify-content: center;">
                    <h2 id="qv-title" style="font-size: 1.5rem; margin-bottom: 15px;"></h2>
                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary); margin-bottom: 30px;">
                        <span id="qv-price"></span>
                        <span id="qv-oldprice" style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through; margin-left: 10px;"></span>
                    </div>
                    <button id="qv-add-cart" class="cta-button" style="width: 100%; text-align: center; border: none; cursor: pointer;">Add to Cart</button>
                    <a id="qv-more-details" href="#" style="text-align: center; margin-top: 15px; color: var(--text-muted); font-size: 0.9rem; text-decoration: underline;">View Full Details</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.qv-close').onclick = () => {
            modal.style.opacity = '0'; modal.style.visibility = 'hidden';
            modal.querySelector('.qv-content').style.transform = 'scale(0.9)';
        };
        modal.onclick = (e) => {
            if (e.target === modal) modal.querySelector('.qv-close').click();
        };
    }
    
    // Populate data
    document.getElementById('qv-title').innerText = name;
    document.getElementById('qv-price').innerText = price;
    document.getElementById('qv-oldprice').innerText = oldPrice ? oldPrice : '';
    document.getElementById('qv-img').src = imgSrc;
    
    // Setup View Full Details link
    if (clickAttr) {
        const urlMatch = clickAttr.match(/location\.href='([^']+)'/);
        if (urlMatch) document.getElementById('qv-more-details').href = urlMatch[1];
    }

    // Setup add to cart action
    document.getElementById('qv-add-cart').onclick = () => {
        let cart = JSON.parse(localStorage.getItem('yj_cart')) || [];
        const existing = cart.find(c => c.name === name);
        if(existing) { existing.qty += 1; } 
        else { cart.push({ name: name, price: price, img: imgSrc, qty: 1 }); }
        localStorage.setItem('yj_cart', JSON.stringify(cart));
        
        showToast('Added to Cart!');
        modal.querySelector('.qv-close').click(); // Close Modal
        
        // Open sliding drawer automatically to show they added it!
        if(typeof updateDrawerCart === 'function') updateDrawerCart();
        const drawer = document.querySelector('.cart-drawer');
        const overlay = document.querySelector('.cart-drawer-overlay');
        if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        }
    };
    
    // Show modal
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.querySelector('.qv-content').style.transform = 'scale(1)';
}

// Inject on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectQuickViewButtons, 300); 
});

// Hook into dynamic category loading to apply Quick View to cloud items too
const originalLoadCategoryProducts = typeof loadCategoryProducts === 'function' ? loadCategoryProducts : null;
if (originalLoadCategoryProducts) {
    window.loadCategoryProducts = async function(category) {
        await originalLoadCategoryProducts(category);
        setTimeout(injectQuickViewButtons, 300);
    };
}
