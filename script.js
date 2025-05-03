// Хранилище файлов (в реальном приложении это будет база данных)
let files = [];

// Обработка загрузки файла
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('file');
    const filenameInput = document.getElementById('filename');
    const statusDiv = document.getElementById('uploadStatus');
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('filename', filenameInput.value);
    
    try {
        statusDiv.textContent = 'Загрузка...';
        statusDiv.className = 'upload-status';
        
        // В реальном приложении здесь будет запрос к серверу
        // const response = await fetch('/upload', {
        //     method: 'POST',
        //     body: formData
        // });
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Создаем уникальный URL для файла
        const fileId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const fileUrl = `/files/${fileId}`;
        
        // Добавляем файл в хранилище
        files.push({
            id: fileId,
            name: filenameInput.value,
            originalName: fileInput.files[0].name,
            fileObject: fileInput.files[0],
            size: fileInput.files[0].size,
            date: new Date().toLocaleString()
        });
        
        // Обновляем список файлов
        updateFilesList();
        
        statusDiv.textContent = 'Файл успешно загружен!';
        statusDiv.className = 'upload-status success';
        
        // Очищаем форму
        fileInput.value = '';
        filenameInput.value = '';
        
    } catch (error) {
        statusDiv.textContent = error.message || 'Ошибка при загрузке файла';
        statusDiv.className = 'upload-status error';
    }
});

// Функция обновления списка файлов
function updateFilesList() {
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = '';
    
    files.forEach(file => {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        
        fileCard.innerHTML = `
            <h3>${file.name}</h3>
            <p>Оригинальное имя: ${file.originalName}</p>
            <p>Размер: ${formatFileSize(file.size)}</p>
            <p>Дата загрузки: ${file.date}</p>
            <button onclick="downloadFile('${file.id}')" class="download-button">Скачать</button>
        `;
        
        filesList.appendChild(fileCard);
    });
}

// Функция для скачивания файла
function downloadFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Создаем ссылку на Blob для скачивания
    const blob = new Blob([file.fileObject], { type: file.fileObject.type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Функция форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 