async function loadUsers() {
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const users = data.record.users || [];
        
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';
        
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.phone || ''}</td>
                <td>
                    <button onclick="editUser(${index})" class="btn btn-primary">Редактировать</button>
                    <button onclick="deleteUser(${index})" class="btn btn-danger">Удалить</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }
}

async function saveUser(userData) {
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const users = data.record.users || [];
        
        if (userData.index !== undefined) {
            users[userData.index] = userData;
        } else {
            users.push(userData);
        }
        
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ ...data.record, users })
        });
        
        await loadUsers();
    } catch (error) {
        console.error('Ошибка сохранения пользователя:', error);
    }
}

async function deleteUser(index) {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const users = data.record.users || [];
        
        users.splice(index, 1);
        
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ ...data.record, users })
        });
        
        await loadUsers();
    } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
    }
}

// Export functions
window.loadUsers = loadUsers;
window.saveUser = saveUser;
window.deleteUser = deleteUser; 