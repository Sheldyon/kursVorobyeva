let cart = {
    tickets: [],
    tables: []
};

function addToCart(type) {
    const select = type === 'ticket' ? document.getElementById('ticket-type') : document.getElementById('table-type');
    const selectedOption = select.options[select.selectedIndex];
    const item = {
        type: selectedOption.value,
        price: parseInt(selectedOption.textContent.match(/\d+/)[0]) // Извлечение цены из текста опции
    };
    if (type === 'ticket') {
        cart.tickets.push(item);
    } else {
        cart.tables.push(item);
    }
    updateCart();
}

function removeFromCart(type, index) {
    if (type === 'ticket') {
        cart.tickets.splice(index, 1);
    } else {
        cart.tables.splice(index, 1);
    }
    updateCart();
}

function updateCart() {
    const ticketList = document.getElementById('ticket-list');
    const tableList = document.getElementById('table-list');

    ticketList.innerHTML = '';
    tableList.innerHTML = '';

    cart.tickets.forEach((ticket, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ticket.type} - ${ticket.price} BUN`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Убрать из корзины';
        removeButton.addEventListener('click', () => removeFromCart('ticket', index));
        listItem.appendChild(removeButton);
        ticketList.appendChild(listItem);
    });

    cart.tables.forEach((table, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${table.type} - ${table.price} BUN`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Убрать из корзины';
        removeButton.addEventListener('click', () => removeFromCart('table', index));
        listItem.appendChild(removeButton);
        tableList.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("payment-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Получаем данные из формы
        const cardNumber = document.getElementById("card-number").value;
        const cardHolder = document.getElementById("card-holder").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;

        // Проверяем корректность данных
        const validationResult = validateFormData(cardNumber, cardHolder, expiryDate, cvv);
        if (validationResult.isValid) {
            // Создаем XML-документ
            const xmlDoc = document.implementation.createDocument(null, "payment");

            // Создаем элементы и добавляем их в документ
            const paymentElement = xmlDoc.getElementsByTagName("payment")[0];

            const cardNumberElement = xmlDoc.createElement("cardNumber");
            cardNumberElement.textContent = cardNumber;
            paymentElement.appendChild(cardNumberElement);

            const cardHolderElement = xmlDoc.createElement("cardHolder");
            cardHolderElement.textContent = cardHolder;
            paymentElement.appendChild(cardHolderElement);

            const expiryDateElement = xmlDoc.createElement("expiryDate");
            expiryDateElement.textContent = expiryDate;
            paymentElement.appendChild(expiryDateElement);

            const cvvElement = xmlDoc.createElement("cvv");
            cvvElement.textContent = cvv;
            paymentElement.appendChild(cvvElement);

            // Получаем XML-строку из документа
            const xmlString = new XMLSerializer().serializeToString(xmlDoc);
            console.log("XML-данные:", xmlString);

            // Выводим сообщение об успешном платеже
            const successMessage = document.getElementById("success-message");
            successMessage.textContent = "Платеж успешно обработан! С вами свяжется администратор в течение 5 минут.";
            successMessage.style.display = "block";

            // Очищаем форму после успешного платежа
            form.reset();

            // Очищаем корзину
            cart.tickets = [];
            cart.tables = [];
            updateCart();

            // Скрываем сообщение об успешном платеже через несколько секунд
            setTimeout(function() {
                successMessage.style.display = "none";
            }, 5000);
        } else {
            // Выводим сообщения об ошибках на странице
            const errorElement = document.getElementById("form-error");
            errorElement.textContent = validationResult.errorMessage;
        }
    });

});

function validateFormData(cardNumber, cardHolder, expiryDate, cvv) {
    // Проверка наличия данных в полях и их формата
    const cardNumberRegex = /^\d{16}$/; // Формат номера карты: 16 цифр
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Формат срока действия: ММ/ГГ
    const cvvRegex = /^\d{3}$/; // Формат CVV: 3 цифры

    // Проверка валидности номера карты
    if (!cardNumberRegex.test(cardNumber)) {
        return { isValid: false, errorMessage: "Пожалуйста, введите корректный номер карты (16 цифр)." };
    }

    // Проверка валидности срока действия
    if (!expiryDateRegex.test(expiryDate)) {
        return { isValid: false, errorMessage: "Пожалуйста, введите корректный срок действия (ММ/ГГ)." };
    }

    // Проверка валидности CVV
    if (!cvvRegex.test(cvv)) {
        return { isValid: false, errorMessage: "Пожалуйста, введите корректный CVV (3 цифры)." };
    }

    // Проверка наличия данных в поле "Имя владельца карты"
    if (cardHolder.trim().length === 0) {
        return { isValid: false, errorMessage: "Пожалуйста, введите имя владельца карты." };
    }

    return { isValid: true, errorMessage: "" };
}
ы