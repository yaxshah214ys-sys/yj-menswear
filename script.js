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
