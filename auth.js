const userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || [];

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabs = document.querySelectorAll('.tab');
const authForms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (!username || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (userDatabase.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, 
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        stats: {
            followers: 0,
            videos: 0,
            views: 0
        },
        description: "Welcome to my profile! I'm a content creator who loves making videos about technology and innovation. Join me on my journey!",
        socialLinks: {
            youtube: '',
            instagram: '',
            twitter: '',
            tiktok: ''
        }
    };
    
    userDatabase.push(newUser);
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    alert('Registration successful!');
    window.location.href = 'profile.html';
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    
    const user = userDatabase.find(u => u.email === email && u.password === password);
    
    if (user) {
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        window.location.href = 'profile.html';
    } else {
        alert('Invalid email or password');
    }
});

document.getElementById('forgot-password')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset functionality would be implemented here');
});

document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        alert(`${this.textContent.trim()} login would be implemented here`);
    });
});

localStorage.setItem('currentUser', JSON.stringify(newUser));
