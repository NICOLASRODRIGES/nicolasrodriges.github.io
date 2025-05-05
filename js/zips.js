async function loadZips() {
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const zips = data.record.zips || [];
        
        const tableBody = document.getElementById('zipsTableBody');
        tableBody.innerHTML = '';
        
        zips.forEach((zip, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${zip.name || ''}</td>
                <td>${zip.description || ''}</td>
                <td>${zip.url || ''}</td>
                <td>
                    <button onclick="editZip(${index})" class="btn btn-primary">Редактировать</button>
                    <button onclick="deleteZip(${index})" class="btn btn-danger">Удалить</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки архивов:', error);
    }
}

async function saveZip(zipData) {
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const zips = data.record.zips || [];
        
        if (zipData.index !== undefined) {
            zips[zipData.index] = zipData;
        } else {
            zips.push(zipData);
        }
        
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ ...data.record, zips })
        });
        
        await loadZips();
    } catch (error) {
        console.error('Ошибка сохранения архива:', error);
    }
}

async function deleteZip(index) {
    if (!confirm('Вы уверены, что хотите удалить этот архив?')) {
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        const zips = data.record.zips || [];
        
        zips.splice(index, 1);
        
        await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ ...data.record, zips })
        });
        
        await loadZips();
    } catch (error) {
        console.error('Ошибка удаления архива:', error);
    }
}

// Export functions
window.loadZips = loadZips;
window.saveZip = saveZip;
window.deleteZip = deleteZip; 