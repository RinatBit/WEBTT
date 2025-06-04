document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const savedPosts = JSON.parse(localStorage.getItem('blog-posts')) || [];
    const post = savedPosts.find(p => p.id == postId);

    if (!post) {
        window.location.href = 'blog.html';
        return;
    }

    const postTitleEl = document.querySelector('.post-title') || document.querySelector('.post-header h1');
    if (postTitleEl) postTitleEl.textContent = post.title;

    const categoryEl = document.querySelector('.post-category');
    if (categoryEl) {
        categoryEl.textContent = post.category;
        categoryEl.style.backgroundColor = getCategoryColor(post.category);
    }


    const dateEl = document.querySelector('.post-date');
    if (dateEl) {
        dateEl.innerHTML = `<i class="far fa-clock"></i> ${post.date}`;
    }

    const avatarEl = document.querySelector('.author-info img');
    if (avatarEl) {
        avatarEl.src = post.imageData || 'https://via.placeholder.com/300x169?text=No+Image';
    }

    const authorNameEl = document.querySelector('.author-info strong');
    if (authorNameEl) {
        authorNameEl.textContent = post.author || 'Unknown';
    }

    const videoContainer = document.querySelector('.post-video-full');
    if (post.videoUrl) {
        const embedUrl = convertYouTubeUrl(post.videoUrl);
        videoContainer.innerHTML = `<iframe width="100%" height="360" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        videoContainer.innerHTML = '<div class="post-video-fallback"><p>This post doesn\'t contain a video</p></div>';
    }

    const postContent = document.querySelector('.post-content');
    postContent.innerHTML = `<p>${post.content.replace(/\n/g, '</p><p>')}</p>`;

    const commentInput = document.getElementById('comment-input');
    const postCommentBtn = document.getElementById('post-comment-btn');
    const commentsList = document.getElementById('comments-list');
    const commentCount = document.getElementById('comment-count');
    const commentCountTitle = document.getElementById('comment-count-title');

    let comments = JSON.parse(localStorage.getItem(`post-comments-${postId}`)) || [];

    function updateCommentCount() {
        const count = comments.length;
        commentCount.textContent = count;
        commentCountTitle.textContent = count;
    }

    function displayComments() {
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
            return;
        }

        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <img src="https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}" class="comment-avatar" alt="User">
                <div class="comment-content">
                    <div class="comment-author">${comment.author || 'Anonymous'}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-meta">
                        <span>${formatDate(comment.date)}</span>
                        <span class="comment-like"><i class="far fa-thumbs-up"></i> Like</span>
                    </div>
                </div>
            `;
            commentsList.appendChild(commentElement);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    postCommentBtn.addEventListener('click', function () {
        const commentText = commentInput.value.trim();
        if (commentText === '') return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

        const newComment = {
            text: commentText,
            author: currentUser.username || 'Anonymous',
            date: new Date().toISOString(),
            likes: 0
        };

        comments.unshift(newComment);
        localStorage.setItem(`post-comments-${postId}`, JSON.stringify(comments));

        commentInput.value = '';
        displayComments();
        updateCommentCount();
    });

    commentInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postCommentBtn.click();
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('comment-like') || e.target.closest('.comment-like')) {
            e.target.classList.toggle('liked');
            const icon = e.target.querySelector('i') || e.target;
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#FF7A00';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        }
    });

    displayComments();
    updateCommentCount();

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

    function convertYouTubeUrl(url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        const short = url.match(/(?:https?:\/\/)?youtu\.be\/([^?]+)/);
        if (short && short[1]) {
            return `https://www.youtube.com/embed/${short[1]}`;
        }
        return url;
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const savedPosts = JSON.parse(localStorage.getItem('blog-posts')) || [];
    const post = savedPosts.find(p => p.id == postId);

    if (!post) {
        window.location.href = 'blog.html';
        return;
    }

    const postTitleEl = document.querySelector('.post-title') || document.querySelector('.post-header h1');
    if (postTitleEl) postTitleEl.textContent = post.title;

    const categoryEl = document.querySelector('.post-category');
    if (categoryEl) {
        categoryEl.textContent = post.category;
        categoryEl.style.backgroundColor = getCategoryColor(post.category);
    }

    const dateEl = document.querySelector('.post-date');
    if (dateEl) {
        dateEl.innerHTML = `<i class="far fa-clock"></i> ${post.date}`;
    }

    const avatarEl = document.querySelector('.author-info img');
    if (avatarEl) {
        avatarEl.src = post.imageData || 'https://via.placeholder.com/300x169?text=No+Image';
    }

    const authorNameEl = document.querySelector('.author-info strong');
    if (authorNameEl) {
        authorNameEl.textContent = post.author || 'Unknown';
    }

    const videoContainer = document.querySelector('.post-video-full');
    if (post.videoUrl) {
        const embedUrl = convertYouTubeUrl(post.videoUrl);
        videoContainer.innerHTML = `<iframe width="100%" height="360" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        videoContainer.innerHTML = '<div class="post-video-fallback"><p>This post doesn\'t contain a video</p></div>';
    }

    // Контент
    const postContent = document.querySelector('.post-content');
    postContent.innerHTML = `<p>${post.content.replace(/\n/g, '</p><p>')}</p>`;

    // Комментарии
    const commentInput = document.getElementById('comment-input');
    const postCommentBtn = document.getElementById('post-comment-btn');
    const commentsList = document.getElementById('comments-list');
    const commentCount = document.getElementById('comment-count');
    const commentCountTitle = document.getElementById('comment-count-title');

    let comments = JSON.parse(localStorage.getItem(`post-comments-${postId}`)) || [];

    function updateCommentCount() {
        const count = comments.length;
        commentCount.textContent = count;
        commentCountTitle.textContent = count;
    }

    function displayComments() {
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
            return;
        }

        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <img src="https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}" class="comment-avatar" alt="User">
                <div class="comment-content">
                    <div class="comment-author">${comment.author || 'Anonymous'}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-meta">
                        <span>${formatDate(comment.date)}</span>
                        <span class="comment-like"><i class="far fa-thumbs-up"></i> Like</span>
                    </div>
                </div>
            `;
            commentsList.appendChild(commentElement);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    postCommentBtn.addEventListener('click', function () {
        const commentText = commentInput.value.trim();
        if (commentText === '') return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

        const newComment = {
            text: commentText,
            author: currentUser.username || 'Anonymous',
            date: new Date().toISOString(),
            likes: 0
        };

        comments.unshift(newComment);
        localStorage.setItem(`post-comments-${postId}`, JSON.stringify(comments));

        commentInput.value = '';
        displayComments();
        updateCommentCount();
    });

    commentInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postCommentBtn.click();
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('comment-like') || e.target.closest('.comment-like')) {
            e.target.classList.toggle('liked');
            const icon = e.target.querySelector('i') || e.target;
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#FF7A00';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        }
    });

    displayComments();
    updateCommentCount();

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

    function convertYouTubeUrl(url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        const short = url.match(/(?:https?:\/\/)?youtu\.be\/([^?]+)/);
        if (short && short[1]) {
            return `https://www.youtube.com/embed/${short[1]}`;
        }
        return url; 
    }
});
