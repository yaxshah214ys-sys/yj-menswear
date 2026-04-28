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
        alert("Please login to continue with your purchase.");
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }
}

// Global Auth Check for Protected Pages
document.querySelectorAll('a[href*="checkout.html"], a[href*="dashboard-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        handlePurchase(e, btn.getAttribute('href'));
    });
});

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
        globalSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = globalSearch.value.toLowerCase();
                if (query.includes('wallet')) window.location.href = `wallets.html?search=${query}`;
                else if (query.includes('belt')) window.location.href = `belts.html?search=${query}`;
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
