// Data Layer: Storage Service
class StorageService {
    static STORAGE_KEY = 'lumina_crm_customers';

    static getCustomers() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static addCustomer(customer) {
        const customers = this.getCustomers();
        const newCustomer = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...customer
        };
        customers.unshift(newCustomer); // Add to top
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
        return newCustomer;
    }

    static deleteCustomer(id) {
        const customers = this.getCustomers().filter(c => c.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
    }
}

// UI Handling
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderCustomers();
    checkReminders();
    
    // Check reminders every minute
    setInterval(checkReminders, 60000);
});

// Modal Funcs
function openModal() {
    document.getElementById('customerModal').classList.add('active');
}

function closeModal() {
    document.getElementById('customerModal').classList.remove('active');
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customer = Object.fromEntries(formData.entries());
    
    StorageService.addCustomer(customer);
    
    e.target.reset();
    closeModal();
    renderCustomers();
}

// Rendering
function renderCustomers() {
    const customers = StorageService.getCustomers();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const list = document.getElementById('customerList');
    
    list.innerHTML = '';

    const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.location.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">
                <i data-lucide="inbox" style="width: 48px; height: 48px; opacity: 0.5; margin-bottom: 1rem;"></i>
                <p>No customers found.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filtered.forEach(c => {
        const card = document.createElement('div');
        card.className = 'glass-panel customer-card animate-fade-in';
        
        // Reminder Logic
        let reminderHtml = '';
        if (c.followUp) {
            const date = new Date(c.followUp);
            const now = new Date();
            const isUrgent = date < now; // In the past means overdue/urgent
            const dateStr = date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            
            reminderHtml = `
                <div class="reminder-tag ${isUrgent ? 'urgent' : ''}">
                    <i data-lucide="${isUrgent ? 'alert-circle' : 'clock'}" style="width: 16px;"></i>
                    ${isUrgent ? 'Overdue: ' : 'Follow-up: '} ${dateStr}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="customer-name">${c.name}</h3>
                    <div class="info-row" style="margin-top: 0.25rem;">
                        <span class="customer-type">${c.type}</span>
                        <span style="font-size: 0.8rem; opacity: 0.8;">${c.size || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div class="info-row">
                <i data-lucide="phone" style="width: 16px;"></i>
                ${c.contact}
            </div>
            <div class="info-row">
                <i data-lucide="map-pin" style="width: 16px;"></i>
                ${c.location}
            </div>
            
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.4;">
                ${c.requirements || 'No specific requirements.'}
            </div>

            ${reminderHtml}
        `;
        list.appendChild(card);
    });
    
    lucide.createIcons();
}

function checkReminders() {
    const customers = StorageService.getCustomers();
    const now = new Date();
    // In a real app, we might show browser notifications here
    // For now, we rely on the visual "Overdue" tag in the UI
    renderCustomers(); 
}
