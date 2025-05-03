// Хранилище файлов (в реальном приложении это будет база данных)
let files = [];

// Обработка загрузки файла
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('file');
    const resultDiv = document.getElementById('result');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    resultDiv.textContent = 'Загрузка...';
    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            // Добавляем файл в список
            files.push({
                name: data.filename,
                originalName: data.filename,
                size: data.size,
                date: new Date(data.date).toLocaleString(),
                url: `http://localhost:5000${data.url}`
            });
            updateFilesList();
            resultDiv.textContent = 'Файл успешно загружен!';
        } else {
            resultDiv.textContent = data.error || 'Ошибка загрузки';
        }
    } catch (err) {
        resultDiv.textContent = 'Ошибка соединения с сервером';
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
            <a href="${file.url}" class="file-link" target="_blank">Скачать</a>
        `;
        
        filesList.appendChild(fileCard);
    });
}

// Функция форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 