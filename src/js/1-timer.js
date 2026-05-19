
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const inputPicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysTgt = document.querySelector('[data-days]');
const hoursTgt = document.querySelector('[data-hours]');
const minutesTgt = document.querySelector('[data-minutes]');
const secondsTgt = document.querySelector('[data-seconds]');


let userSelectedDate = null;
let timerId = null;


const options = {
  enableTime: true,        
  time_24hr: true,         
  defaultDate: new Date(), 
  minuteIncrement: 1,      
  onClose(selectedDates) {
 
    const selectedTime = selectedDates[0];

    
    if (selectedTime <= new Date()) {
      
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
      userSelectedDate = null;  
    } else {
     
      userSelectedDate = selectedTime;
      startBtn.disabled = false; 
    }
  },
};


flatpickr(inputPicker, options);


startBtn.addEventListener('click', () => {
 
  if (!userSelectedDate) return;


  startBtn.disabled = true;
  inputPicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = userSelectedDate - currentTime; 
   
    if (deltaTime <= 0) {
      clearInterval(timerId); 
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
      inputPicker.disabled = false; 
      return;
    }
    
    const timeComponents = convertMs(deltaTime);    
  
    updateTimerInterface(timeComponents);
  }, 1000);
});


function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysTgt.textContent = addLeadingZero(days);
  hoursTgt.textContent = addLeadingZero(hours);
  minutesTgt.textContent = addLeadingZero(minutes);
  secondsTgt.textContent = addLeadingZero(seconds);
}


function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


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