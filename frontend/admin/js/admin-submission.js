// Contact Submissions Management

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('submissionsTableBody')) {
        loadSubmissions();
    }
});

async function loadSubmissions() {
    try {
        const submissions = await contactAPI.getAll();
        const tbody = document.getElementById('submissionsTableBody');
        
        if (tbody) {
            tbody.innerHTML = submissions.map(submission => `
                <tr>
                    <td>${new Date(submission.createdAt).toLocaleDateString()}</td>
                    <td>${submission.name}</td>
                    <td>${submission.email}</td>
                    <td>${submission.phone}</td>
                    <td>${submission.service}</td>
                    <td>
                        <span class="status-badge ${submission.status}">
                            ${submission.status}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn view" onclick="viewMessage('${submission._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="updateStatus('${submission._id}', '${submission.status}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteSubmission('${submission._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Update counts
        updateSubmissionStats(submissions);
        
        // Update recent submissions on dashboard
        updateRecentSubmissions(submissions.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading submissions:', error);
    }
}

function updateSubmissionStats(submissions) {
    const total = submissions.length;
    const newCount = submissions.filter(s => s.status === 'new').length;
    
    const totalSubmissions = document.getElementById('totalSubmissions');
    const submissionCount = document.getElementById('submissionCount');
    
    if (totalSubmissions) {
        totalSubmissions.textContent = newCount;
    }
    
    if (submissionCount) {
        submissionCount.textContent = newCount;
    }
}

function updateRecentSubmissions(recent) {
    const container = document.getElementById('recentSubmissions');
    if (!container) return;
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent submissions</p>';
        return;
    }
    
    container.innerHTML = recent.map(sub => `
        <div class="submission-item" onclick="viewMessage('${sub._id}')">
            <div class="submission-header">
                <strong>${sub.name}</strong>
                <span class="status-badge ${sub.status}">${sub.status}</span>
            </div>
            <div class="submission-preview">
                ${sub.message.substring(0, 50)}...
            </div>
            <div class="submission-meta">
                ${new Date(sub.createdAt).toLocaleString()}
            </div>
        </div>
    `).join('');
}

async function viewMessage(id) {
    try {
        const submissions = await contactAPI.getAll();
        const submission = submissions.find(s => s._id === id);
        
        if (!submission) return;
        
        const modal = document.getElementById('messageModal');
        const details = document.getElementById('messageDetails');
        
        details.innerHTML = `
            <div class="message-detail-item">
                <label>Name:</label>
                <p>${submission.name}</p>
            </div>
            <div class="message-detail-item">
                <label>Email:</label>
                <p><a href="mailto:${submission.email}">${submission.email}</a></p>
            </div>
            <div class="message-detail-item">
                <label>Phone:</label>
                <p><a href="tel:${submission.phone}">${submission.phone}</a></p>
            </div>
            <div class="message-detail-item">
                <label>Service:</label>
                <p>${submission.service}</p>
            </div>
            <div class="message-detail-item">
                <label>Message:</label>
                <p>${submission.message}</p>
            </div>
            <div class="message-detail-item">
                <label>Submitted:</label>
                <p>${new Date(submission.createdAt).toLocaleString()}</p>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Mark as read if new
        if (submission.status === 'new') {
            await updateStatus(id, 'read', false);
        }
        
    } catch (error) {
        console.error('Error viewing message:', error);
    }
}

async function updateStatus(id, currentStatus, showPrompt = true) {
    if (showPrompt) {
        const statuses = ['new', 'read', 'replied'];
        const newStatus = prompt(`Enter new status (${statuses.join(', ')}):`, currentStatus);
        
        if (!newStatus || !statuses.includes(newStatus)) {
            alert('Invalid status');
            return;
        }
        
        try {
            await contactAPI.updateStatus(id, newStatus);
            await loadSubmissions();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    } else {
        try {
            await contactAPI.updateStatus(id, 'read');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
}

async function deleteSubmission(id) {
    if (confirm('Are you sure you want to delete this submission?')) {
        try {
            await contactAPI.delete(id);
            await loadSubmissions();
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('Failed to delete submission');
        }
    }
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}