document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('file');
    const emailInput = document.getElementById('email');
    const statusDiv = document.getElementById('uploadStatus');
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('email', emailInput.value);
    
    try {
        statusDiv.textContent = 'Загрузка...';
        statusDiv.className = 'upload-status';
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            statusDiv.textContent = 'Файл успешно загружен!';
            statusDiv.className = 'upload-status success';
            fileInput.value = '';
            emailInput.value = '';
        } else {
            throw new Error(result.message || 'Ошибка при загрузке файла');
        }
    } catch (error) {
        statusDiv.textContent = error.message;
        statusDiv.className = 'upload-status error';
    }
}); 