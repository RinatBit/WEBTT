document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.resources-tabs .tab');
    const addResourceBtn = document.getElementById('add-resource-btn');
    const addResourceForm = document.getElementById('add-resource-form');
    const cancelResourceBtn = document.getElementById('cancel-resource');
    const resourceForm = document.getElementById('resource-form');
    const resourcesGrid = document.getElementById('resources-grid');
    
    function loadResources(category = 'all') {
        const resources = JSON.parse(localStorage.getItem('resources')) || [];
        resourcesGrid.innerHTML = '';
        
        const filteredResources = category === 'all' 
            ? resources 
            : resources.filter(r => r.category.toLowerCase() === category);
        
        if (filteredResources.length === 0) {
            resourcesGrid.innerHTML = '<p class="no-resources">No resources found</p>';
            return;
        }
        
        filteredResources.forEach(resource => {
            const iconClass = getIconForCategory(resource.category);
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.innerHTML = `
                <div class="resource-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <h3>${resource.title}</h3>
                <p>${resource.category}</p>
                <a href="${resource.url}" target="_blank" class="download-btn">
                    Open Resource <i class="fas fa-external-link-alt"></i>
                </a>
            `;
            resourcesGrid.appendChild(card);
        });
    }
    
    function getIconForCategory(category) {
        const icons = {
            'Tutorials': 'fa-video',
            'Templates': 'fa-file-alt',
            'E-books': 'fa-book-open',
            'Tools': 'fa-tools'
        };
        return icons[category] || 'fa-link';
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadResources(this.dataset.tab);
        });
    });
    
    addResourceBtn.addEventListener('click', function() {
        addResourceForm.style.display = 'block';
        window.scrollTo({
            top: addResourceForm.offsetTop - 20,
            behavior: 'smooth'
        });
    });
    
    cancelResourceBtn.addEventListener('click', function() {
        addResourceForm.style.display = 'none';
        resourceForm.reset();
    });
    
    resourceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newResource = {
            title: document.getElementById('resource-title').value,
            url: document.getElementById('resource-url').value,
            category: document.getElementById('resource-category').value
        };
        
        const resources = JSON.parse(localStorage.getItem('resources')) || [];
        resources.push(newResource);
        localStorage.setItem('resources', JSON.stringify(resources));
        
        resourceForm.reset();
        addResourceForm.style.display = 'none';
        loadResources();
        
        showNotification('Resource added successfully!', 'success');
    });
    
    loadResources();
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
            <div class="notification-progress"></div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
});

async function fetchLinkPreview(url) {
    try {
        const response = await fetch(`https://api.linkpreview.net/?key=ВАШ_API_KEY&q=${url}`);
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("Error fetching preview:", e);
        return null;
    }
}

function addDeleteFeature() {
    const cards = document.querySelectorAll('.resource-card');
    cards.forEach(card => {
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        card.appendChild(deleteBtn);
    });
}

document.querySelector('.search-bar input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.resource-card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});