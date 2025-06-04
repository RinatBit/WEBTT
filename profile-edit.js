document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const profileForm = document.getElementById('profile-form');
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    const profileAvatar = document.getElementById('profile-avatar');

    let profileData = JSON.parse(localStorage.getItem('currentUser')) || {
    name: "",
    email: "",
    avatar: "",
    description: "",
    stats: {
        followers: "0",
        videos: 0,
        views: "0"
    }
};


    function loadProfileData() {
        document.getElementById('profile-name').textContent = profileData.name;
        document.getElementById('profile-email').textContent = profileData.email;
        document.getElementById('profile-description').textContent = profileData.description;
        profileAvatar.src = profileData.avatar;
        
        document.getElementById('followers-count').textContent = profileData.stats.followers;
        document.getElementById('videos-count').textContent = profileData.stats.videos;
        document.getElementById('views-count').textContent = profileData.stats.views;
    }

    editBtn.addEventListener('click', function() {
        document.getElementById('edit-name').value = profileData.name;
        document.getElementById('edit-email').value = profileData.email;
        document.getElementById('edit-description').value = profileData.description;
        avatarPreview.src = profileData.avatar;
        modal.style.display = "block";
    });

    function closeModalWindow() {
        modal.style.display = "none";
    }

    closeModal.addEventListener('click', closeModalWindow);
    cancelBtn.addEventListener('click', closeModalWindow);

    avatarUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        profileData = {
            ...profileData,
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            description: document.getElementById('edit-description').value,
            avatar: avatarPreview.src
        };

        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        loadProfileData();
        closeModalWindow();
        
        showNotification('Profile updated successfully!');
    });

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        profileData = JSON.parse(savedProfile);
    }

    loadProfileData();

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const updatedProfile = {
        ...profileData,
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        description: document.getElementById('edit-description').value,
        avatar: avatarPreview.src
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify({
            ...currentUser,
            avatar: avatarPreview.src
        }));
    }
    
    loadProfileData();
    closeModalWindow();
    showNotification('Profile updated successfully!');
});

