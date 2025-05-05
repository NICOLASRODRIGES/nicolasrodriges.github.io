async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function generateSessionToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('error');
    
    errorDiv.style.display = 'none';
    
    if (!username || !password) {
        errorDiv.textContent = 'Пожалуйста, введите имя пользователя и пароль';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(window.API_CONFIG.API_URL, {
            headers: { 'X-Master-Key': window.API_CONFIG.API_KEY }
        });
        const data = await response.json();
        const admins = data.record.admins || {};
        
        const hashedPassword = await hashPassword(password);
        
        if (admins[username] && admins[username].password === hashedPassword) {
            const sessionToken = await generateSessionToken();
            localStorage.setItem('sessionToken', sessionToken);
            localStorage.setItem('adminUsername', username);
            
            admins[username].sessionToken = sessionToken;
            admins[username].lastLogin = new Date().toISOString();
            
            await fetch(window.API_CONFIG.API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': window.API_CONFIG.API_KEY
                },
                body: JSON.stringify({ ...data.record, admins })
            });
            
            window.location.href = 'index.html';
        } else {
            errorDiv.textContent = 'Неверное имя пользователя или пароль';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        errorDiv.textContent = 'Произошла ошибка при входе в систему';
        errorDiv.style.display = 'block';
    }
}

async function checkAuth() {
    const sessionToken = localStorage.getItem('sessionToken');
    const adminUsername = localStorage.getItem('adminUsername');
    
    if (sessionToken && adminUsername) {
        try {
            const response = await fetch(window.API_CONFIG.API_URL, {
                headers: { 'X-Master-Key': window.API_CONFIG.API_KEY }
            });
            const data = await response.json();
            const admins = data.record.admins || {};
            
            if (admins[adminUsername] && admins[adminUsername].sessionToken === sessionToken) {
                window.location.href = 'index.html';
            } else {
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('adminUsername');
            }
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
        }
    }
}

function logout() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('adminUsername');
    window.location.href = 'login.html';
}

// Export functions
window.login = login;
window.checkAuth = checkAuth;
window.logout = logout; 