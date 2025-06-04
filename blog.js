document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const commentForms = document.querySelectorAll('.comment-form');

    commentForms.forEach(form => {
        if (!currentUser) {
            form.innerHTML = '<p>Please <a href="auth.html">sign in</a> to leave a comment</p>';
            return;
        }
        form.innerHTML = `
            <img class="comment-avatar" src="${currentUser.avatar}" alt="${currentUser.username}">
            <div class="comment-input-container">
                <textarea placeholder="Add your comment..."></textarea>
                <div class="comment-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Post Comment</button>
                </div>
            </div>`;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            if (textarea.value.trim()) {
                const comment = {
                    author: currentUser.username,
                    avatar: currentUser.avatar,
                    text: textarea.value.trim(),
                    date: new Date().toLocaleString()
                };
                alert('Comment posted by ' + currentUser.username);
                textarea.value = '';
            }
        });
    });

    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', () => uploadArea.querySelector('input').click());
        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--accent-color)';
            this.style.background = 'rgba(255,122,0,0.1)';
        });
        uploadArea.addEventListener('dragleave', function () {
            this.style.borderColor = 'rgba(255,122,0,0.3)';
            this.style.background = 'transparent';
        });
        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255,122,0,0.3)';
            this.style.background = 'transparent';
            const file = e.dataTransfer.files[0];
            if (file?.type.includes('video')) {
                alert('Video "' + file.name + '" ready for upload!');
            } else {
                alert('Please upload a video file');
            }
        });
    }

    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (email.includes('@')) {
                alert('Thanks for subscribing!');
                this.querySelector('input').value = '';
            }
        });
    });

    const postThumbnails = document.querySelectorAll('.post-thumbnail');
    postThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const postLink = this.closest('.post-card').querySelector('h4 a');
            if (postLink) window.location.href = postLink.href;
        });
    });

    const createPostBtn = document.getElementById('create-post-btn');
    const createPostForm = document.getElementById('create-post-form');
    const cancelPostBtn = document.getElementById('cancel-post');
    const postForm = document.getElementById('post-form');

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i><span>${message}</span>
            </div>
            <div class="notification-progress"></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    createPostBtn?.addEventListener('click', function () {
        createPostForm.style.display = 'block';
        window.scrollTo({ top: createPostForm.offsetTop - 20, behavior: 'smooth' });
    });

    cancelPostBtn?.addEventListener('click', function () {
        createPostForm.style.display = 'none';
        postForm.reset();
    });

    postForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value.trim();
        const category = document.getElementById('post-category').value;
        const videoUrl = document.getElementById('post-video-url').value.trim();
        const content = document.getElementById('post-content').value.trim();
        const imageInput = document.getElementById('post-image');
        const imageFile = imageInput.files[0];

        const savedPosts = JSON.parse(localStorage.getItem('blog-posts')) || [];

        // Проверка на дубликаты
        if (savedPosts.some(p => p.title === title && p.content === content)) {
            showNotification('Such post already exists!', 'warning');
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            title,
            category,
            videoUrl,
            content,
            date: new Date().toLocaleString(),
            imageData: null,
            author: currentUser?.username || 'Anonymous'
        };

        const finalizePost = () => {
            savedPosts.unshift(newPost);
            localStorage.setItem('blog-posts', JSON.stringify(savedPosts));
            showNotification('Post published successfully!', 'success');
            postForm.reset();
            createPostForm.style.display = 'none';
            addNewPost(newPost);
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                newPost.imageData = event.target.result;
                finalizePost();
            };
            reader.readAsDataURL(imageFile);
        } else {
            finalizePost();
        }
    });

    const savedPosts = JSON.parse(localStorage.getItem('blog-posts')) || [];
    savedPosts.forEach(post => addNewPost(post));

    function addNewPost(post) {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid || document.querySelector(`[data-post-id="${post.id}"]`)) return;

    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = post.id;

    const thumbnailSrc = post.imageData || 'https://via.placeholder.com/300x169?text=No+Thumbnail';

    postCard.innerHTML = `
        <div class="post-thumbnail">
            <img src="${thumbnailSrc}" alt="Post thumbnail">
            ${post.videoUrl ? '<div class="play-icon"><i class="fas fa-play"></i></div>' : ''}
        </div>
        <div class="post-info">
            <span class="post-category" style="background-color: ${getCategoryColor(post.category)}">${post.category}</span>
            <h4><a href="single-post.html?id=${post.id}">${post.title}</a></h4>
            <div class="post-meta">
                <span><i class="far fa-clock"></i> ${post.date}</span>
                <span><i class="far fa-comment"></i> 0</span>
            </div>
        </div>`;

    postsGrid.prepend(postCard);
}


    function getCategoryColor(category) {
        const colors = {
            'Tutorial': '#FF7A00',
            'Equipment': '#6C5CE7',
            'Tips': '#00B894',
            'Lighting': '#FD79A8',
            'Audio': '#0984E3',
            'Analytics': '#FDCB6E'
        };
        return colors[category] || '#6C5CE7';
    }
});