import * as flsFunctions from "./modules/functions.js";
import "./modules/jquery-3.7.1.min.js";
import AirDatepicker from 'air-datepicker';
import "./modules/bootstrap.bundle.min.js";
import "./modules/ion.rangeSlider.min.js";
import "./modules/inputmask.min.js";
import { Fancybox } from "./modules/fancybox.esm.js";
import ClipboardJS from 'clipboard';
import { CountUp } from '../../node_modules/countup.js/dist/countUp.js';


import './components.js';

flsFunctions.isWebp();

// Import swiper
import Swiper, { Navigation, Pagination, Autoplay, Mousewheel, EffectFade, Thumbs, Scrollbar } from 'swiper';
Swiper.use([Navigation, Pagination, Autoplay, Mousewheel, EffectFade, Thumbs, Scrollbar]);

Fancybox.bind("[data-fancybox]", {
  closeButton: false,
});


let inputs = document.querySelectorAll('input[type="tel"]');
let im = new Inputmask({
  mask: '+7 (999) 999-99-99',
  onBeforePaste: function (pastedValue, opts) {
    // Удаляем всё, кроме цифр
    var processedValue = pastedValue.replace(/\D/g, "");

    // Если первая цифра 7 или 8 и в строке 11 цифр, убираем первую
    if (processedValue.length === 11 && (processedValue[0] === '7' || processedValue[0] === '8')) {
      return processedValue.substring(1);
    }

    return pastedValue;
  },
  onKeyDown: function (event, buffer, caretPos, opts) {
    console.log(caretPos.begin);
    // Проверяем:
    // 1. Позиция каретки (caretPos) равна 5 (вторая цифра в "99")
    // 2. Нажата клавиша "8"
    if (caretPos.begin === 9 && event.key === '8') {
      event.preventDefault(); // Запрещаем ввод
      console.log("Ввод 8 в этой позиции запрещен!");
    }
  }
});

im.mask(inputs);



let calendarArray = document.querySelectorAll('.calendar');
calendarArray.forEach(el => {
  // air datepicker
  new AirDatepicker(el, {
    minDate: new Date(),
    autoClose: true,
    position: 'top right',
  });

  Inputmask("datetime", {
    inputFormat: "dd.mm.yyyy",
    placeholder: "ДД.ММ.ГГГГ",
    leapday: "29-02-",
    separator: ".",
    alias: "dd/mm/yyyy"
  }).mask(el);

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
    // например: `# / page / ${ dataLinkValue } `

    skipLink.href = `/ ${dataLinkValue} `;

    // console.log(`Слайд изменен.Кнопка обновлена, href: ${ skipLink.href } `);
  } else {
    // console.warn("Активный слайд не содержит атрибута 'data-link'.");
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
  // overlayToggle();
});

let menuItemBurger = document.querySelector('.menu-item-burger');
let fixedMenuSubmenu = document.querySelector('.fixed-menu-submenu');
let menuItemBurgerClose = document.querySelector('.fixed-menu-submenu-close');
menuItemBurger?.addEventListener('click', function (e) {
  e.preventDefault(); // Отменяет переход
  fixedMenuSubmenu.classList.toggle('active');
  menuItemBurger.classList.toggle('active');
});
menuItemBurgerClose?.addEventListener('click', function (e) {
  fixedMenuSubmenu.classList.remove('active');
  menuItemBurger.classList.remove('active');
});

let copyBtnArray = document.querySelectorAll('.copyBtn');
copyBtnArray.forEach(el => {
  var clipboard = new ClipboardJS(el);
  clipboard.on('success', function (e) {
    // console.log('Action:', e.action);
    // console.log('Text:', e.text);
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

const terminNavW = document.getElementById('terminNavW');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.scrollY;

  if (currentScrollTop > lastScrollTop) {
    // Прокрутка вниз
    terminNavW?.classList.remove('active');
    terminNavW?.classList.add('header-fixed-hide');
  } else {
    // Прокрутка вверх
    terminNavW?.classList.add('active');
    terminNavW?.classList.remove('header-fixed-hide');
  }
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Сохраняем предыдущее значение
});


// http://ionden.com/a/plugins/ion.rangeSlider/start.html
$(".js-range-slider").ionRangeSlider({
  min: 0,
  max: 20,
  step: 0.5,
  from: 10,
  onStart: function (data) {
    // console.log(data.input);
    // console.log(data.slider);
  }
});

$(".js-range-slider-finance").ionRangeSlider({
  min: 0,
  max: 100,
  step: 0.5,
  from: 20,
  onStart: function (data) {
    // console.log(data.input);
    // console.log(data.slider);
  }
});

const accordHeads = document.querySelectorAll('.accord-item-head');

// Имя класса, который будет отвечать за открытое состояние
const OPEN_CLASS = 'is-open';

accordHeads.forEach(head => {
  head.addEventListener('click', function () {

    // 1. Находим родительский контейнер
    const parentItem = this.closest('.accord-item');
    if (!parentItem) return;

    // 2. Находим контент, который нужно открыть/закрыть
    const content = parentItem.querySelector('.accord-item-content');

    if (!content) return;

    // 3. Логика "Один открыт, остальные закрыты" (Аккордеон)

    // Проверяем, открыт ли уже этот элемент
    const currentlyOpen = content.classList.contains(OPEN_CLASS);

    // Сначала закрываем все открытые элементы, чтобы избежать наложения анимаций
    document.querySelectorAll('.accord-item-content.is-open').forEach(openContent => {
      openContent.classList.remove(OPEN_CLASS);
    });

    // 4. Открываем/Закрываем текущий элемент
    if (!currentlyOpen) {
      // Если он был закрыт (или только что был закрыт в цикле выше), открываем его
      content.classList.add(OPEN_CLASS);
    }
    // Если он уже был открыт и мы его закрыли в цикле выше, ничего не делаем.
    // Если бы не было "один открыт, остальные закрыты", мы бы просто использовали:
    // content.classList.toggle(OPEN_CLASS);

  });
});

let pofileBtnW = document.querySelector('.pofileBtnW');
let profileSubmenu = document.querySelector('.profile-submenu');

let formInputSelectArray = document.querySelectorAll('.formInput--select');



pofileBtnW?.addEventListener('click', () => {
  profileSubmenu.classList.toggle('active');
});


document.addEventListener('click', e => {
  let target = e.target;
  let its_profileSubmenu = target == profileSubmenu || profileSubmenu?.contains(target);
  let its_pofileBtnW = target == pofileBtnW || pofileBtnW?.contains(target);

  formInputSelectArray?.forEach(input => {
    let fieldHidden = input.closest('.selectW').querySelector('.fieldHidden');

    let its_input = target == input || input.contains(target);
    let its_fieldHidden = target == fieldHidden || fieldHidden.contains(target);

    if (!its_input && !its_fieldHidden) {
      fieldHidden.classList.remove('active');
    }

    if (its_input) {
      fieldHidden.classList.toggle('active');

    }

  });

  if (!its_profileSubmenu && !its_pofileBtnW) {
    profileSubmenu?.classList.remove('active');
  }

});

let fieldHiddenInputs = document.querySelectorAll('.fieldHidden input');
fieldHiddenInputs.forEach(input => {
  const statusElement = input.closest('.selectW').querySelector('.formInput--select');
  let resetBtn = input.closest('.selectW').querySelector('.reset-values');

  input.addEventListener('change', function () {
    // 'this.checked' возвращает true, если элемент выбран, и false, если снят
    const isChecked = this.checked;

    if (isChecked) {
      statusElement.value = `${this.value} `;
    }
  });

  resetBtn.addEventListener('click', () => {
    statusElement.value = '';
    input.checked = false;
  });

});


const dropWithDataParent = document.querySelectorAll('[data-parent]');
const dropWithDataChild = document.querySelectorAll('[data-child]');

if (dropWithDataParent.length > 0) {
  // console.log(`Найдено элементов с атрибутом data - parent: ${ dropWithDataParent.length } `);

  // Пример работы с найденными элементами:
  dropWithDataParent.forEach((element, index) => {
    const parentValue = element.getAttribute('data-parent');
    let btn = element.querySelector('.btn-dropdown');
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      dropWithDataChild.forEach(child => {
        if (child.getAttribute('data-child') == parentValue) {
          child.classList.toggle('active');
        }
      });
    });
  });
}


let searchActionBtn = document.querySelector('.searchActionBtn');
let searchHidden = document.querySelector('.searchHidden');

searchActionBtn?.addEventListener('click', () => {
  searchActionBtn.classList.toggle('active');
  searchHidden.classList.toggle('active');
});

let digitElements = document.querySelectorAll(".digit-box");

digitElements.forEach((targetElement) => {
  let id = targetElement.getAttribute('id');
  let value = targetElement.dataset.val;
  const demo = new CountUp(id, value, {
    separator: ' ',
    enableScrollSpy: true,
  });
  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }
});


const donuts = document.querySelectorAll('.chart--donut');

// 2. Определяем, что делать, когда элемент становится видимым
const handleIntersect = (entries, observer) => {
  entries.forEach(entry => {
    // entry.isIntersecting === true, когда элемент вошел в область видимости
    if (entry.isIntersecting) {

      // Запускаем анимацию, меняя состояние play-state
      entry.target.style.animationPlayState = 'running';

      // Отключаем наблюдение, чтобы анимация не запускалась повторно при скролле вверх/вниз
      observer.unobserve(entry.target);
    }
  });
};

// 3. Настраиваем Intersection Observer
const observerOptions = {
  root: null, // Используем вьюпорт как корень
  rootMargin: '0px', // Не отступаем от краев
  threshold: 0.1 // Запускать, когда 10% элемента видно
};

const observer = new IntersectionObserver(handleIntersect, observerOptions);

// 4. Начинаем наблюдать за каждым элементом
donuts.forEach(donut => {
  observer.observe(donut);
});