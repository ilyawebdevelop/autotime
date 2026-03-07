import * as flsFunctions from "./modules/functions.js";
import "./modules/jquery-3.7.1.min.js";
import AirDatepicker from 'air-datepicker';
import "./modules/bootstrap.bundle.min.js";
import { Fancybox } from "./modules/fancybox.esm.js";
import ClipboardJS from 'clipboard'; // or require('clipboard')

import './components.js';

flsFunctions.isWebp();

// Import swiper
import Swiper, { Navigation, Pagination, Autoplay, Mousewheel, EffectFade, Thumbs, Scrollbar } from 'swiper';
Swiper.use([Navigation, Pagination, Autoplay, Mousewheel, EffectFade, Thumbs, Scrollbar]);

Fancybox.bind("[data-fancybox]", {
  closeButton: false,
});


let calendarArray = document.querySelectorAll('.calendar');

calendarArray.forEach(el => {
  // air datepicker
  new AirDatepicker(el, {
    minDate: new Date(),
    autoClose: true,
    position: 'top right',
  });
});




function enterCode() {
  const inputs = document.querySelectorAll('.otp-input');

  inputs.forEach((input, index) => {

    // 1. Обработчик ввода (keyup) для перехода вперед
    input.addEventListener('keyup', function (e) {
      const currentValue = this.value;
      const maxLength = parseInt(this.getAttribute('maxlength'));
      const nextIndex = parseInt(this.getAttribute('data-next'));

      // Проверяем, что введено только одно число и оно не является стрелкой
      if (currentValue.length >= maxLength && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {

        // Если это не последнее поле, переходим к следующему
        if (nextIndex < inputs.length) {
          inputs[nextIndex].focus();
        } else {
          // Если это последнее поле, снимаем фокус (или делаем что-то еще)
          this.blur();
        }
      }
    });

    // 2. Обработчик обратного перехода (Backspace/ArrowLeft)
    input.addEventListener('keydown', function (e) {
      // Если пользователь нажал Backspace и поле пустое, переходим назад
      if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && this.value === "") {
        e.preventDefault(); // Предотвращаем стандартное поведение (удаление символа)

        // Если это не первое поле, переходим к предыдущему
        if (index > 0) {
          inputs[index - 1].focus();
          // Очищаем предыдущее поле, чтобы пользователь мог ввести новую цифру
          inputs[index - 1].value = "";
        }
      }
    });

    // 3. Ограничение на ввод (чтобы не вводили лишние символы, хотя type="number" это частично решает)
    input.addEventListener('input', function () {
      // Обрезаем значение, если пользователь каким-то образом ввел больше 1 символа
      if (this.value.length > 1) {
        this.value = this.value.slice(0, 1);
      }
      // Удаляем нечисловые символы, если они вдруг просочились
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  });
}

const togglePassword = document.querySelectorAll('.togglePasswordBtn');
togglePassword.forEach(el => {
  let password = el.closest('.form-floating').querySelector("input[type='password']");
  el.addEventListener('click', () => {
    // Toggle the type attribute using
    // getAttribure() method
    const type = password.getAttribute('type') === 'password' ?
      'text' : 'password';
    password.setAttribute('type', type);
  });
});

enterCode();

const skipLink = document.getElementById('first-skip-link');
// Инициализация слайдера first-auth-slider
const firstAuthSlider = document.querySelector('.first-auth-slider');
var mySwiperFirstAuth = new Swiper(firstAuthSlider, {
  slidesPerView: 1,
  speed: 800,
  spaceBetween: 20,
  navigation: {
    nextEl: firstAuthSlider?.querySelector('.navArrowNext'),
  },
  pagination: {
    el: document.querySelector('.first-auth-slider .swiper-pagination'),
    clickable: true,
    type: 'bullets',
  },
  on: {
    slideChange: function () {
      updateSkipLink(this);
    }
  }
});

function updateSkipLink(swiperInstance) {
  // Получаем текущий активный слайд
  const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];

  // Извлекаем значение data-link из активного слайда
  const dataLinkValue = activeSlide?.getAttribute('data-link');

  if (dataLinkValue) {
    // Устанавливаем новое значение в атрибут href кнопки
    // В данном примере, мы просто присваиваем значение. Если вы хотите 
    // использовать это как реальную ссылку, возможно, вам нужно будет добавить префикс, 
    // например: `#/page/${dataLinkValue}`

    skipLink.href = `/${dataLinkValue}`;

    console.log(`Слайд изменен. Кнопка обновлена, href: ${skipLink.href}`);
  } else {
    console.warn("Активный слайд не содержит атрибута 'data-link'.");
  }
}

// Вызываем функцию один раз при загрузке, чтобы установить ссылку для первого слайда
updateSkipLink(mySwiperFirstAuth);

// Burger
const btnMenu = document.querySelector('#toggle');
const menu = document.querySelector('.headerNav');
const bodyEl = document.querySelector('body');


const toggleMenu = function () {
  menu.classList.toggle('active');
}
const toggleBurger = function () {
  btnMenu.classList.toggle('active');
}
const bodyOverflow = function () {
  bodyEl.classList.toggle('hidden');
}

btnMenu?.addEventListener('click', function (e) {
  e.stopPropagation();
  toggleMenu();
  toggleBurger();
  bodyOverflow();
  overlayToggle();
});


let copyBtnArray = document.querySelectorAll('.copyBtn');
copyBtnArray.forEach(el => {
  var clipboard = new ClipboardJS(el);
  clipboard.on('success', function (e) {
    console.log('Action:', e.action);
    console.log('Text:', e.text);
    el.classList.add('copied');
    e.clearSelection();
    var tooltipEl = el;
    var tooltip = new bootstrap.Tooltip(tooltipEl);
    tooltip.show()

    setTimeout(function () {
      tooltip.hide();
      tooltip.disable();
    }, 2000);

  });
});



let searchClearBtn = document.querySelectorAll('.form-floating .remove-text');
searchClearBtn.forEach(el => {
  let input = el.closest('.form-floating').querySelector('input');

  input.addEventListener("focus", (event) => {
    el.classList.add('active');
  });

  el.addEventListener('click', () => {
    input.value = '';
    // input.focus();
    el.classList.remove('active');
  });

});
