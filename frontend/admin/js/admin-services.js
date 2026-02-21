// Services Management

let currentServiceId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('servicesTableBody')) {
        loadServices();
    }
    
    // Service form submission
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleServiceSubmit);
    }
});

async function loadServices() {
    try {
        const services = await servicesAPI.getAll();
        const tbody = document.getElementById('servicesTableBody');
        
        if (tbody) {
            tbody.innerHTML = services.map(service => `
                <tr>
                    <td>
                        <img src="${service.image || '../assets/images/service-default.jpg'}" 
                             alt="${service.title}"
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    </td>
                    <td>${service.title}</td>
                    <td>${service.description.substring(0, 50)}...</td>
                    <td>${service.order || 0}</td>
                    <td>
                        <span class="status-badge ${service.active ? 'read' : 'new'}">
                            ${service.active ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn edit" onclick="editService('${service._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteService('${service._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Update dashboard stats
        updateServiceCount(services.length);
        
    } catch (error) {
        console.error('Error loading services:', error);
        alert('Failed to load services');
    }
}

function showServiceModal(service = null) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('serviceModalTitle');
    
    if (service) {
        title.textContent = 'Edit Service';
        document.getElementById('serviceId').value = service._id;
        document.getElementById('serviceTitle').value = service.title;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('serviceIcon').value = service.icon || 'fa-wrench';
        document.getElementById('serviceImage').value = service.image || '';
        document.getElementById('serviceOrder').value = service.order || 0;
        document.getElementById('serviceActive').checked = service.active !== false;
        currentServiceId = service._id;
    } else {
        title.textContent = 'Add New Service';
        document.getElementById('serviceForm').reset();
        document.getElementById('serviceId').value = '';
        currentServiceId = null;
    }
    
    modal.style.display = 'block';
}

function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    
    const serviceData = {
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        icon: document.getElementById('serviceIcon').value,
        image: document.getElementById('serviceImage').value,
        order: parseInt(document.getElementById('serviceOrder').value),
        active: document.getElementById('serviceActive').checked
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        if (currentServiceId) {
            await servicesAPI.update(currentServiceId, serviceData);
        } else {
            await servicesAPI.create(serviceData);
        }
        
        closeServiceModal();
        await loadServices();
        
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Failed to save service');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

async function editService(id) {
    try {
        const service = await servicesAPI.getById(id);
        showServiceModal(service);
    } catch (error) {
        console.error('Error loading service:', error);
        alert('Failed to load service details');
    }
}

async function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await servicesAPI.delete(id);
            await loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    }
}

function updateServiceCount(count) {
    const totalServices = document.getElementById('totalServices');
    if (totalServices) {
        totalServices.textContent = count;
    }
}