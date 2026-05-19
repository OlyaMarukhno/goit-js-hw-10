 // 1. Импортируем iziToast и его стили
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// 2. Находим форму на странице
const form = document.querySelector('.form');

// 3. Вешаем слушатель события на сабмит (отправку) формы
form.addEventListener('submit', event => {
  // Обязательно отменяем стандартное поведение браузера (перезагрузку страницы)
  event.preventDefault();

  // Получаем значения из полей формы
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  // 4. Создаем промис по условию задачи
  createPromise(delay, state)
    .then(delay => {
      // Этот блок выполнится, если промис будет ТАКЖЕ fulfilled (успешным)
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      // Этот блок выполнится, если промис будет rejected (отклоненным)
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  // Очищаем форму после сабмита (необязательно, но менторы любят аккуратность)
  form.reset();
});

// 5. Функция-генератор промиса
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    // Запускаем таймер на указанное пользователем количество миллисекунд
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay); // Успешное выполнение, передаем delay
      } else {
        reject(delay);  // Отклонение, передаем delay
      }
    }, delay);
  });
}