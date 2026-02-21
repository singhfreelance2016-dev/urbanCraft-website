// Admin Authentication

document.addEventListener('DOMContentLoaded', () => {
    // Check if on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if on dashboard page
    if (document.querySelector('.dashboard-page')) {
        checkAuth();
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    try {
        const response = await authAPI.login({ username, password });
        
        // Save token
        localStorage.setItem('adminToken', response.token);
        
        // Show success message
        loginMessage.innerHTML = `
            <div class="login-message success">
                <i class="fas fa-check-circle"></i>
                Login successful! Redirecting...
            </div>
        `;
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        loginMessage.innerHTML = `
            <div class="login-message error">
                <i class="fas fa-exclamation-circle"></i>
                ${error.message || 'Invalid username or password'}
            </div>
        `;
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
    }
}

async function checkAuth() {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        await authAPI.verify();
    } catch (error) {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}