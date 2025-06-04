document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('video-posts');

    function getAllPosts() {
        return JSON.parse(localStorage.getItem('blog-posts')) || [];
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

    function renderPosts(posts) {
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'video-item';
            card.style.cursor = 'pointer';

            const embedUrl = post.videoUrl ? convertYouTubeUrl(post.videoUrl) : null;
            const thumbnail = post.imageData || 'https://via.placeholder.com/300x169?text=No+Thumbnail';

            card.innerHTML = `
                ${embedUrl ? `<img src="${thumbnail}" style="width:100%; height:160px; object-fit:cover;">` : `<img src="${thumbnail}" style="width:100%; height:160px; object-fit:cover;">`}
                <p class="video-title">${post.title}</p>
            `;

            card.addEventListener('click', () => {
                window.location.href = `single-post.html?id=${post.id}`;
            });

            postsContainer.appendChild(card);
        });
    }

    const allPosts = getAllPosts();
    renderPosts(allPosts);
});
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    toggle?.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });
});
