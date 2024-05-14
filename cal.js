document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.querySelector('#calendar tbody');
    
    // События для разных дней
    const events = {
        3: "SODA LUV 22:00-04:00",
        7: "Mayot 21:00-01:00",
        15: "RISK 20:00-02:00",
        20: "Fonkguy 18:00-03:00"
    };

    // Массив имен диджеев
    const djNames = [
        "DJ Xesha",
        "DJ Zolrd",
        "DJ ARIK",
        "DJ FLyWay",
        "DJ GRUPPI"
    ];

    // Генерация случайного имени диджея
    function getRandomDJName() {
        return djNames[Math.floor(Math.random() * djNames.length)];
    }

    // Генерация календаря
    function generateCalendar() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Получаем первый день месяца и количество дней в месяце
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        let date = 1;
        // Создаем строки для календаря
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            
            // Создаем ячейки для каждого дня в строке
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDayOfMonth) {
                    // Пустые ячейки до начала месяца
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    // Пустые ячейки после окончания месяца
                    row.appendChild(cell);
                } else {
                    // Ячейка с числом и событием, если есть
                    cell.textContent = date;
                    if (events[date]) {
                        const eventText = document.createElement('span');
                        eventText.textContent = events[date];
                        cell.appendChild(document.createElement('br'));
                        cell.appendChild(eventText);
                    } else {
                        // Добавляем случайного диджея, если нет события
                        const djName = getRandomDJName();
                        const djText = document.createElement('span');
                        djText.textContent = djName;
                        cell.appendChild(document.createElement('br'));
                        cell.appendChild(djText);
                    }
                    row.appendChild(cell);
                    date++;
                }
            }
            
            calendarBody.appendChild(row);
        }
    }
    
    generateCalendar();
});
const calendarContainer = document.querySelector('.calendar-container');

let touchstartX = 0;
let touchendX = 0;

calendarContainer.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
}, false);

calendarContainer.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchendX < touchstartX) {
        // Свайп влево (пустой блок для примера)
        console.log('Swiped left');
    }

    if (touchendX > touchstartX) {
        // Свайп вправо (пустой блок для примера)
        console.log('Swiped right');
    }
}

