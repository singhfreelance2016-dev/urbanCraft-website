// Contact form handling

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        service: form.service.value,
        message: form.message.value
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Clear previous messages
    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = '';
    formMessage.className = 'form-message';
    
    try {
        const response = await contactAPI.submit(formData);
        
        // Show success message
        formMessage.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                ${response.message}
            </div>
        `;
        
        // Reset form
        form.reset();
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } catch (error) {
        // Show error message
        formMessage.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                ${error.message || 'Something went wrong. Please try again.'}
            </div>
        `;
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}