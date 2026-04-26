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
