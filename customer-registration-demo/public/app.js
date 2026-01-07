// Customer Registration Demo JavaScript
const API_BASE = 'http://localhost:3300/api/registration';

console.log('🚀 Customer Registration Demo Initialized');

// Tab functionality
function showTab(tabName) {
    console.log('🔄 Switching to tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName);
    const targetButton = document.querySelector(`.tab[data-tab="${tabName}"]`);
    
    if (targetTab) {
        targetTab.classList.add('active');
        console.log('✅ Tab content shown:', tabName);
    } else {
        console.error('❌ Tab content not found:', tabName);
    }
    
    if (targetButton) {
        targetButton.classList.add('active');
        console.log('✅ Tab button activated:', tabName);
    } else {
        console.error('❌ Tab button not found:', tabName);
    }
    
    // Auto-load plans when plans tab is opened
    if (tabName === 'plans') {
        console.log('📋 Auto-loading plans...');
        loadPlans();
    }
}

// Load phone numbers
async function loadAvailablePhoneNumbers() {
    try {
        console.log('📱 Loading available phone numbers...');
        const response = await fetch(`${API_BASE}/phone-numbers`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const datalist = document.getElementById('phoneNumbersList');
            datalist.innerHTML = '';
            
            result.data.forEach(phone => {
                const option = document.createElement('option');
                option.value = phone.number;
                option.label = `${phone.number} - ${phone.category} (${phone.status})`;
                datalist.appendChild(option);
            });
            console.log(`✅ Loaded ${result.data.length} phone numbers`);
        } else {
            console.error('❌ Failed to load phone numbers:', result);
        }
    } catch (error) {
        console.error('❌ Error loading phone numbers:', error);
    }
}

// Load plans
async function loadPlans() {
    try {
        console.log('📋 Loading service plans...');
        const response = await fetch(`${API_BASE}/plans`);
        const result = await response.json();
        
        if (result.success && result.data) {
            displayPlansAsCards(result.data);
            console.log(`✅ Loaded ${result.data.length} service plans`);
        } else {
            console.error('❌ Failed to load plans:', result);
            showResponse('plansResponse', result, !response.ok);
        }
    } catch (error) {
        console.error('❌ Error loading plans:', error);
        showResponse('plansResponse', { error: error.message }, true);
    }
}

// Display plans as beautiful cards
function displayPlansAsCards(plans) {
    console.log('🎨 Displaying plans as cards...');
    console.log('📋 Plans data received:', plans);
    
    const plansContainer = document.getElementById('plansList');
    if (!plansContainer) {
        console.error('❌ Plans container not found');
        return;
    }
    
    let html = '<div class="plans-grid">';
    
    plans.forEach((plan, index) => {
        console.log(`🔄 Processing plan ${index}:`, plan);
        const isPopular = index === 1; // Make the second plan popular
        const isEnterprise = index === 2; // Make the third plan enterprise
        const planFeatures = plan.features || ['Unlimited calls', 'Unlimited texts', 'Data included'];
        
        // Format large numbers as "Unlimited"
        const formatAllowance = (value, unit) => {
            if (value >= 999999) return 'Unlimited';
            if (unit === 'GB' && value >= 100) return `${value}GB`;
            return `${value} ${unit}`;
        };
        
        html += `
            <div class="plan-card ${isPopular ? 'popular' : ''} ${isEnterprise ? 'enterprise' : ''}">
                ${isPopular ? '<div class="popular-badge">MOST POPULAR</div>' : ''}
                ${isEnterprise ? '<div class="enterprise-badge">ENTERPRISE</div>' : ''}
                <div class="plan-header">
                    <h3 class="plan-name">${plan.name}</h3>
                    <div class="plan-price">
                        <span class="currency">$</span>
                        <span class="amount">${plan.monthlyFee || plan.price}</span>
                        <span class="period">/month</span>
                    </div>
                    <p class="plan-description">${plan.description || 'Perfect for your needs'}</p>
                </div>
                
                <div class="plan-features">
                    <ul>
                        <li class="feature-item">
                            <span class="feature-icon">📱</span>
                            <span class="feature-text">${formatAllowance(plan.dataAllowance?.amount, 'GB')} Data</span>
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">📞</span>
                            <span class="feature-text">${formatAllowance(plan.voiceAllowance?.minutes, 'Minutes')} Calls</span>
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">💬</span>
                            <span class="feature-text">${formatAllowance(plan.smsAllowance?.count, 'SMS')} SMS</span>
                        </li>
                        ${planFeatures.map(feature => `
                            <li class="feature-item">
                                <span class="feature-icon">✓</span>
                                <span class="feature-text">${feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="plan-footer">
                    <button class="btn-select-plan" data-plan-id="${plan.id}" data-plan-name="${plan.name}">
                        Select Plan
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    plansContainer.innerHTML = html;
    
    // Add event listeners to plan selection buttons
    document.querySelectorAll('.btn-select-plan').forEach(button => {
        button.addEventListener('click', (e) => {
            const planId = e.target.getAttribute('data-plan-id');
            const planName = e.target.getAttribute('data-plan-name');
            selectPlan(planId, planName);
        });
    });
    
    console.log('✅ Plan cards displayed successfully');
}

// Handle plan selection
function selectPlan(planId, planName) {
    console.log('🎯 Plan selected:', planId, planName);
    
    // Update the registration form plan dropdown
    const planSelect = document.getElementById('plan');
    if (planSelect) {
        planSelect.value = planId;
        console.log('✅ Updated registration form with selected plan');
    }
    
    // Switch to registration tab
    showTab('register');
    
    // Show confirmation
    alert(`✅ "${planName}" plan selected! Please complete the registration form.`);
}

// Count available phone numbers
async function countPhoneNumbers() {
    console.log('🔢 Starting countPhoneNumbers function...');
    
    try {
        const response = await fetch(`${API_BASE}/phone-numbers`);
        console.log('📡 Count response status:', response.status);
        
        const result = await response.json();
        console.log('📊 Count response data:', result);
        
        if (result.success && result.data) {
            const totalCount = result.data.length;
            const availableCount = result.data.filter(phone => phone.status === 'AVAILABLE').length;
            const reservedCount = result.data.filter(phone => phone.status === 'RESERVED').length;
            const assignedCount = result.data.filter(phone => phone.status === 'ASSIGNED').length;
            
            alert(`📊 Phone Number Summary:\n\nTotal: ${totalCount}\nAvailable: ${availableCount}\nReserved: ${reservedCount}\nAssigned: ${assignedCount}\n\nAvailable Numbers:\n${result.data.filter(phone => phone.status === 'AVAILABLE').map(phone => `• ${phone.number}`).join('\n')}`);
            
            console.log(`✅ Phone count completed: ${totalCount} total, ${availableCount} available`);
        } else {
            console.error('❌ Invalid response for count:', result);
            alert('❌ Failed to count phone numbers');
        }
    } catch (error) {
        console.error('❌ Error counting phone numbers:', error);
        alert(`❌ Error counting phone numbers: ${error.message}`);
    }
}

// Show response
function showResponse(elementId, data, isError = false) {
    const responseDiv = document.getElementById(elementId);
    responseDiv.style.display = 'block';
    responseDiv.className = 'response ' + (isError ? 'error' : 'success');
    
    // Special handling for customer status data
    if (elementId === 'statusResponse' && data.success && data.data) {
        responseDiv.innerHTML = formatCustomerStatus(data.data);
    } else {
        responseDiv.textContent = JSON.stringify(data, null, 2);
    }
    
    if (isError) {
        console.error('❌ Response Error:', data);
    } else {
        console.log('✅ Response Success:', data);
    }
}

// Format customer status data for better UI
function formatCustomerStatus(data) {
    const customer = data.customer;
    const progress = data.progress || 0;
    const status = data.status || 'pending';
    const nextSteps = data.nextSteps || [];
    
    return `
        <div class="customer-status-card">
            <div class="status-header">
                <h3>Customer Status</h3>
                <span class="status-badge ${status}">${status.toUpperCase()}</span>
            </div>
            
            <div class="customer-info">
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${customer.firstName} ${customer.lastName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Customer ID:</span>
                    <span class="value">${customer.customerId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Phone Number:</span>
                    <span class="value">${customer.phoneNumber}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${customer.email}</span>
                </div>
                <div class="info-row">
                    <span class="label">Account Status:</span>
                    <span class="value">${customer.status}</span>
                </div>
                <div class="info-row">
                    <span class="label">Identity Verification:</span>
                    <span class="value">${customer.identityVerificationStatus}</span>
                </div>
            </div>
            
            <div class="progress-section">
                <h4>Registration Progress</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${progress}% Complete</span>
            </div>
            
            ${nextSteps.length > 0 ? `
                <div class="next-steps">
                    <h4>Next Steps</h4>
                    <ul>
                        ${nextSteps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// Form submissions - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Registration form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Submitting registration form...');
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch(`${API_BASE}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                showResponse('registrationResponse', result, !response.ok);
                
                if (response.ok) {
                    console.log('✅ Registration submitted successfully');
                } else {
                    console.error('❌ Registration failed:', result);
                }
            } catch (error) {
                console.error('❌ Registration error:', error);
                showResponse('registrationResponse', { error: error.message }, true);
            }
        });
    }
    
    // Status form
    const statusForm = document.getElementById('statusForm');
    if (statusForm) {
        statusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('🔍 Checking registration status...');
            const customerId = document.getElementById('customerId').value;
            
            try {
                const response = await fetch(`${API_BASE}/status/${customerId}`);
                const result = await response.json();
                showResponse('statusResponse', result, !response.ok);
                
                if (response.ok) {
                    console.log('✅ Status retrieved successfully');
                } else {
                    console.error('❌ Status check failed:', result);
                }
            } catch (error) {
                console.error('❌ Status check error:', error);
                showResponse('statusResponse', { error: error.message }, true);
            }
        });
    }
});

// Add tab event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            console.log('🖱️ Tab clicked:', tabName);
            showTab(tabName);
        });
    });
    
    // Add click listeners to action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            console.log('🖱️ Action button clicked:', action);
            
            switch(action) {
                case 'refresh-numbers':
                    loadAvailablePhoneNumbers();
                    break;
                case 'count-numbers':
                    countPhoneNumbers();
                    break;
                case 'load-plans':
                    loadPlans();
                    break;
                default:
                    console.warn('❓ Unknown action:', action);
            }
        });
    });
    
    console.log('🎯 Tab and action event listeners attached');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Content Loaded - Initializing application...');
    loadAvailablePhoneNumbers();
    loadPlans();
    console.log('✅ Application initialized successfully');
});

// Add error handling for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled Promise Rejection:', event.reason);
});

// Add error handling for JavaScript errors
window.addEventListener('error', (event) => {
    console.error('❌ JavaScript Error:', event.error);
});

console.log('📋 Customer Registration Demo JavaScript loaded');