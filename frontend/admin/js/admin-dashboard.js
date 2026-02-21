// Dashboard functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadDashboardData();
});

function initializeTabs() {
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    const tabs = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const tabId = link.dataset.tab;
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === tabId) {
                    tab.classList.add('active');
                }
            });
            
            // Update URL hash
            window.location.hash = tabId;
        });
    });
    
    // Check URL hash for initial tab
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tabLink = document.querySelector(`.nav-link[data-tab="${hash}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
}

async function loadDashboardData() {
    try {
        // Load counts for dashboard
        const services = await servicesAPI.getAll();
        const gallery = await galleryAPI.getAll();
        const submissions = await contactAPI.getAll();
        
        // Update stats
        document.getElementById('totalServices').textContent = services.length;
        document.getElementById('totalGallery').textContent = gallery.length;
        
        const newSubmissions = submissions.filter(s => s.status === 'new').length;
        document.getElementById('totalSubmissions').textContent = newSubmissions;
        document.getElementById('submissionCount').textContent = newSubmissions;
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}