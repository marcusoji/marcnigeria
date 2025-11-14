// admin.js - GitHub Private Repository Authentication System

// CONFIGURATION - 
const GITHUB_CONFIG = {
    username: 'marcusoji',
    repo: 'marc-nigeria-auth',
    branch: 'main',
    file: 'admin-config.json',
    token: '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' // Must be in quotes!
};

let adminConfig = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        setupAdminPanel();
    }
});

// SHA-256 hash function
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Fetch admin configuration from private GitHub repository
async function fetchAdminConfig() {
    try {
        // Use GitHub API endpoint instead of raw URL for private repos
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.file}?ref=${GITHUB_CONFIG.branch}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // GitHub API returns base64 encoded content
        const decodedContent = atob(data.content);
        adminConfig = JSON.parse(decodedContent);
        
        console.log('Admin config loaded successfully');
        return true;
    } catch (error) {
        console.error('Error fetching admin config:', error);
        alert('Unable to connect to authentication server. Please check your configuration.');
        return false;
    }
}

function setupAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if already logged in and session is valid
    const loginTime = localStorage.getItem('adminLoginTime');
    const sessionToken = localStorage.getItem('adminSessionToken');
    
    if (sessionToken && loginTime) {
        verifySession().then(isValid => {
            if (isValid) {
                showAdminPanel();
            } else {
                clearSession();
            }
        });
    }

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verifying...';
        submitBtn.disabled = true;
        
        const pin = document.getElementById('admin-pin').value;
        
        // Fetch config from GitHub
        const configLoaded = await fetchAdminConfig();
        
        if (!configLoaded) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Hash the entered PIN
        const hashedPin = await hashPassword(pin);
        
        // Verify against GitHub config
        if (hashedPin === adminConfig.passwordHash) {
            const sessionToken = await hashPassword(Date.now() + pin);
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminLoginTime', Date.now().toString());
            localStorage.setItem('adminSessionToken', sessionToken);
            localStorage.removeItem('failedAttempts');
            
            showAdminPanel();
        } else {
            alert('Invalid PIN. Please try again.');
            
            const attempts = parseInt(localStorage.getItem('failedAttempts') || '0') + 1;
            localStorage.setItem('failedAttempts', attempts.toString());
            
            if (attempts >= 5) {
                alert('Too many failed attempts. Access locked for 10 minutes.');
                submitBtn.disabled = true;
                loginForm.querySelector('input').disabled = true;
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    loginForm.querySelector('input').disabled = false;
                    localStorage.setItem('failedAttempts', '0');
                }, 600000);
            }
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        document.getElementById('admin-pin').value = '';
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        clearSession();
        loginSection.style.display = 'block';
        adminPanel.style.display = 'none';
        document.getElementById('admin-pin').value = '';
    });

    function showAdminPanel() {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        loadDestinationsTable();
        setupAdminEventListeners();
    }
}

// Verify session is still valid
async function verifySession() {
    const loginTime = localStorage.getItem('adminLoginTime');
    if (!loginTime) return false;
    
    const configLoaded = await fetchAdminConfig();
    if (!configLoaded) return false;
    
    const sessionTimeout = adminConfig.sessionTimeout || 7200000;
    if (Date.now() - parseInt(loginTime) > sessionTimeout) {
        alert('Your session has expired. Please login again.');
        return false;
    }
    
    return true;
}

// Clear session
function clearSession() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('failedAttempts');
}

// Setup admin event listeners
function setupAdminEventListeners() {
    const addDestinationBtn = document.getElementById('add-destination-btn');
    const destinationModal = document.getElementById('destination-modal');
    const closeModal = document.getElementById('close-destination-modal');
    const destinationForm = document.getElementById('destination-form');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    addDestinationBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Add New Destination';
        destinationForm.reset();
        document.getElementById('destination-id').value = '';
        destinationModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        destinationModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === destinationModal) {
            destinationModal.style.display = 'none';
        }
    });

    destinationForm.addEventListener('submit', handleDestinationSubmit);
    exportBtn.addEventListener('click', exportDestinations);
    importBtn.addEventListener('click', function() {
        importFile.click();
    });
    importFile.addEventListener('change', handleFileImport);
}

function loadDestinationsTable() {
    const tableBody = document.getElementById('destinations-table-body');
    tableBody.innerHTML = '';

    nigerianDestinations.forEach(destination => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${destination.id}</td>
            <td>${destination.name}</td>
            <td>${destination.location}</td>
            <td>${destination.category}</td>
            <td>${destination.featured ? 'Yes' : 'No'}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${destination.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${destination.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editDestination(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteDestination(id);
        });
    });
}

function handleDestinationSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('destination-id').value;
    const formData = {
        name: document.getElementById('destination-name').value,
        location: document.getElementById('destination-location').value,
        region: document.getElementById('destination-region').value,
        category: document.getElementById('destination-category').value,
        image: document.getElementById('destination-image').value,
        description: document.getElementById('destination-description').value,
        featured: document.getElementById('destination-featured').checked,
        bestTime: document.getElementById('destination-best-time').value,
        highlights: document.getElementById('destination-highlights').value.split(',').map(h => h.trim())
    };

    if (id) {
        updateDestination(id, formData);
    } else {
        addDestination(formData);
    }

    document.getElementById('destination-modal').style.display = 'none';
}

function addDestination(data) {
    const newId = nigerianDestinations.length > 0 ? 
        Math.max(...nigerianDestinations.map(d => d.id)) + 1 : 1;
    
    const newDestination = {
        id: newId,
        ...data
    };

    nigerianDestinations.push(newDestination);
    saveDestinationsToStorage();
    loadDestinationsTable();
    
    alert('Destination added successfully!');
}

function editDestination(id) {
    const destination = nigerianDestinations.find(d => d.id == id);
    if (!destination) return;

    document.getElementById('modal-title').textContent = 'Edit Destination';
    document.getElementById('destination-id').value = destination.id;
    document.getElementById('destination-name').value = destination.name;
    document.getElementById('destination-location').value = destination.location;
    document.getElementById('destination-region').value = destination.region || '';
    document.getElementById('destination-category').value = destination.category;
    document.getElementById('destination-image').value = destination.image;
    document.getElementById('destination-description').value = destination.description;
    document.getElementById('destination-featured').checked = destination.featured || false;
    document.getElementById('destination-best-time').value = destination.bestTime || '';
    document.getElementById('destination-highlights').value = destination.highlights ? destination.highlights.join(', ') : '';

    document.getElementById('destination-modal').style.display = 'flex';
}

function updateDestination(id, data) {
    const index = nigerianDestinations.findIndex(d => d.id == id);
    if (index === -1) return;

    nigerianDestinations[index] = {
        ...nigerianDestinations[index],
        ...data
    };

    saveDestinationsToStorage();
    loadDestinationsTable();
    
    alert('Destination updated successfully!');
}

function deleteDestination(id) {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    nigerianDestinations = nigerianDestinations.filter(d => d.id != id);
    saveDestinationsToStorage();
    loadDestinationsTable();
    
    alert('Destination deleted successfully!');
}

function exportDestinations() {
    const dataStr = JSON.stringify(nigerianDestinations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'marc-nigeria-destinations.json';
    link.click();
}

function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (confirm(`This will replace all current destinations with ${importedData.length} new destinations. Continue?`)) {
                nigerianDestinations = importedData;
                saveDestinationsToStorage();
                loadDestinationsTable();
                alert('Destinations imported successfully!');
            }
        } catch (error) {
            alert('Error importing file. Please check the file format.');
        }
    };
    reader.readAsText(file);
    
    e.target.value = '';
}

function saveDestinationsToStorage() {
    localStorage.setItem('marcNigeriaDestinations', JSON.stringify(nigerianDestinations));
}