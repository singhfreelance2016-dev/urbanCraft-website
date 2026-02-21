// Main JavaScript for public website

// Navigation and Header
document.addEventListener('DOMContentLoaded', () => {
    initializeHeader();
    initializeMobileMenu();
    initializeSmoothScroll();
    loadDynamicContent();
});

function initializeHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load dynamic content from API
async function loadDynamicContent() {
    // Load services if on homepage
    if (document.querySelector('.services-grid')) {
        await loadServices();
    }
    
    // Load gallery if on gallery page
    if (document.querySelector('.gallery-grid')) {
        await loadGallery();
    }
    
    // Load testimonials if on homepage
    if (document.querySelector('.testimonials-grid')) {
        await loadTestimonials();
    }
}

async function loadServices() {
    try {
        const services = await servicesAPI.getAll();
        const servicesGrid = document.querySelector('.services-grid');
        
        if (servicesGrid && services.length > 0) {
            servicesGrid.innerHTML = services.map(service => `
                <div class="service-card fade-in-up">
                    <img src="${service.image || 'assets/images/service-default.jpg'}" 
                         alt="${service.title}"
                         loading="lazy">
                    <div class="service-content">
                        <div class="service-icon">
                            <i class="fas ${service.icon || 'fa-wrench'}"></i>
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.description.substring(0, 150)}...</p>
                        <a href="#" class="btn btn-outline">Learn More</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

async function loadGallery() {
    try {
        const category = new URLSearchParams(window.location.search).get('category') || '';
        const params = category ? `?category=${category}` : '';
        const items = await galleryAPI.getAll(params);
        const galleryGrid = document.querySelector('.gallery-grid');
        
        if (galleryGrid && items.length > 0) {
            galleryGrid.innerHTML = items.map(item => `
                <div class="gallery-item" data-category="${item.category}">
                    <img src="${item.imageUrl}" 
                         alt="${item.title}"
                         loading="lazy">
                    <div class="gallery-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description || ''}</p>
                    </div>
                </div>
            `).join('');
            
            // Initialize gallery filters
            initializeGalleryFilters();
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function initializeGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

async function loadTestimonials() {
    // For demo purposes - in production, fetch from API
    const testimonials = [
        {
            name: 'John Smith',
            role: 'Homeowner',
            text: 'UrbanCraft transformed our outdated kitchen into a modern masterpiece. Their attention to detail and professionalism was outstanding!',
            image: 'assets/images/team/client-1.jpg'
        },
        {
            name: 'Sarah Johnson',
            role: 'Business Owner',
            text: 'The team at UrbanCraft delivered our office renovation on time and under budget. Highly recommended!',
            image: 'assets/images/team/client-2.jpg'
        },
        {
            name: 'Michael Brown',
            role: 'Property Developer',
            text: 'We\'ve worked with UrbanCraft on multiple projects. Their quality and consistency are unmatched.',
            image: 'assets/images/team/client-3.jpg'
        }
    ];
    
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
        testimonialsGrid.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card fade-in-up">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
}