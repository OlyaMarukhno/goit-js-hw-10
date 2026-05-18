// 1. Импортируем библиотеки и их стили (библиотеки должны быть установлены через npm install)
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// 2. Находим все необходимые элементы интерфейса по их селекторам
const inputPicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysTgt = document.querySelector('[data-days]');
const hoursTgt = document.querySelector('[data-hours]');
const minutesTgt = document.querySelector('[data-minutes]');
const secondsTgt = document.querySelector('[data-seconds]');

// 3. Объявляем переменные для хранения выбранной даты и ID интервала
let userSelectedDate = null;
let timerId = null;

// 4. Настройки конфигурации для библиотеки flatpickr
const options = {
  enableTime: true,        // Включает выбор времени (часы, минуты)
  time_24hr: true,         // Формат времени 24 часа
  defaultDate: new Date(), // Устанавливает текущую дату по умолчанию
  minuteIncrement: 1,      // Шаг прокрутки минут
  onClose(selectedDates) {
    // Этот метод вызывается каждый раз, когда календарь закрывается
    const selectedTime = selectedDates[0];

    // Проверка: если выбранная дата в прошлом или равна текущей
    if (selectedTime <= new Date()) {
      // Показываем красивое сообщение об ошибке через iziToast
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true; // Блокируем кнопку Start
      userSelectedDate = null;  // Сбрасываем сохраненную дату
    } else {
      // Если дата валидная (в будущем)
      userSelectedDate = selectedTime;
      startBtn.disabled = false; // Делаем кнопку Start активной
    }
  },
};

// 5. Инициализируем календарь flatpickr на нашем инпуте
flatpickr(inputPicker, options);

// 6. Добавляем слушатель клика на кнопку Start
startBtn.addEventListener('click', () => {
  // Защита: если дата каким-то образом не выбрана, ничего не делаем
  if (!userSelectedDate) return;

  // Как только таймер запустился, блокируем кнопку и инпут (по требованию ТЗ)
  startBtn.disabled = true;
  inputPicker.disabled = true;

  // Запускаем интервал, который будет выполняться каждые 1000 миллисекунд (1 секунду)
  timerId = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = userSelectedDate - currentTime; // Разница времени в миллисекундах

    // Если время полностью вышло или ушло в минус
    if (deltaTime <= 0) {
      clearInterval(timerId); // Останавливаем работу интервала
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Сбрасываем интерфейс на нули
      inputPicker.disabled = false; // Разблокируем инпут для возможности нового выбора
      return;
    }

    // Рассчитываем оставшиеся дни, часы, минуты и секунды из миллисекунд
    const timeComponents = convertMs(deltaTime);
    
    // Обновляем текст на странице
    updateTimerInterface(timeComponents);
  }, 1000);
});

// 7. Функция, которая принимает объект времени и отрисовывает его на экране
function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysTgt.textContent = addLeadingZero(days);
  hoursTgt.textContent = addLeadingZero(hours);
  minutesTgt.textContent = addLeadingZero(minutes);
  secondsTgt.textContent = addLeadingZero(seconds);
}

// 8. Функция форматирования: добавляет 0 в начало, если число состоит из одной цифры (например, "4" -> "04")
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// 9. Функция для подсчета значений (предоставленная в ТЗ)
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}