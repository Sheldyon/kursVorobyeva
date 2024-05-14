document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const openButton = document.getElementById('open-button');
    const closeButton = document.getElementById('close');
    const form = document.querySelector('#registration-form form');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    // Функция для открытия окна регистрации
    function openOverlay() {
        overlay.style.display = 'flex';
    }

    // Функция для закрытия окна регистрации
    function closeOverlay() {
        overlay.style.display = 'none';
    }

    // Функция для сохранения данных из формы в XML формате
    function getFormDataAsXml() {
        const formData = `
            <formData>
                <username>${document.getElementById('username').value}</username>
                <email>${document.getElementById('email').value}</email>
                <password>${document.getElementById('password').value}</password>
                <phone>${document.getElementById('phone').value}</phone>
            </formData>
        `;
        return formData;
    }

    // Функция для сохранения данных в локальном хранилище
    function saveFormData() {
        const xmlData = getFormDataAsXml();
        localStorage.setItem('formDataXML', xmlData);
    }

    // Функция для проверки валидности XML
    function validateXml(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        return xmlDoc.getElementsByTagName('parsererror').length === 0;
    }

    // Функция для скачивания данных в XML формате
    function downloadXmlFile(xmlString) {
        const blob = new Blob([xmlString], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'club.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Обработчик события для кнопки открытия окна регистрации
    openButton.addEventListener('click', openOverlay);

    // Обработчик события для кнопки закрытия окна регистрации
    closeButton.addEventListener('click', closeOverlay);

    // Функция для отображения сообщения об успешной регистрации и закрытия окна
    function showSuccessMessage() {
        alert('ВЫ УСПЕШНО ЗАРЕГИСТРИРОВАНЫ');
        openButton.style.display = 'none'; // Скрыть кнопку открытия окна
        closeOverlay(); // Закрыть окно регистрации
    }

    // Обработчик события для кнопки отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное действие отправки формы

        // Проверка валидности номера телефона
        if (!phoneInput.checkValidity()) {
            phoneError.style.display = 'block';
            phoneInput.focus();
            return;
        } else {
            phoneError.style.display = 'none';
        }

        // Проверка валидности email
        if (!emailInput.checkValidity()) {
            emailError.style.display = 'block';
            emailInput.focus();
            return;
        } else {
            emailError.style.display = 'none';
        }

        const xmlData = getFormDataAsXml();

        if (validateXml(xmlData)) {
            saveFormData(); // Сохраняем данные в локальном хранилище
            downloadXmlFile(xmlData); // Предоставляем пользователю возможность скачать файл
            showSuccessMessage(); // Показываем сообщение об успешной регистрации и закрываем окно
        } else {
            alert('XML-данные невалидны. Пожалуйста, проверьте правильность введенных данных.');
        }
    });

    // Восстанавливаем данные из локального хранилища при загрузке страницы
    const savedFormDataXML = localStorage.getItem('formDataXML');
    if (savedFormDataXML) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(savedFormDataXML, 'text/xml');
        const formData = xmlDoc.getElementsByTagName('formData')[0];
        document.getElementById('username').value = formData.getElementsByTagName('username')[0].textContent;
        document.getElementById('email').value = formData.getElementsByTagName('email')[0].textContent;
        document.getElementById('password').value = formData.getElementsByTagName('password')[0].textContent;
        document.getElementById('phone').value = formData.getElementsByTagName('phone')[0].textContent;
    }
});
