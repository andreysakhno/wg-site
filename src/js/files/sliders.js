/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation, Autoplay, EffectFade, Lazy, Pagination, Thumbs, Controller} from "swiper";
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
//import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
//import 'swiper/css';

import { dataMediaQueries } from "./functions.js";

// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на стронице
	if (document.querySelector('.swiper')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper(".swiper", {
			// Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Autoplay, EffectFade, Lazy],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			autoHeight: true,
			speed: 800,
			grabCursor: true,

			loop: true,
			lazy: true,

			effect: "fade",
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: ".swiper-button-prev",
				nextEl: ".swiper-button-next",
			},
		});
	}

	//SOLUTION SECTION SWIPER INIT

	if (document.querySelector('.swiper-solution')) { 
		new Swiper(".swiper-solution", {
			// Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Lazy],
			observer: true,
			observeParents: true,
			slidesPerView: 1.15,
			spaceBetween: 10,
			autoHeight: false,
			speed: 800,

			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,
			lazy: true,

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: ".slider-solutions__arrow-prev",
				nextEl: ".slider-solutions__arrow-next",
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1.15,
					spaceBetween: 10,
					autoHeight: false,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},

			// События
			on: {},
		});
	}

	//OBJECTS SECTION SWIPER INIT

	if (document.querySelector('.swiper-objects')) { 
		
		new Swiper(".swiper-objects", {
			// Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Lazy],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			autoHeight: false,
			speed: 800,

			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,

			lazy: true,

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: ".objects-slider__prev",
				nextEl: ".objects-slider__next",
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1.15,
					spaceBetween: 10,
					autoHeight: false,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},

			// События
			on: {},
		});
	}	

	if (document.querySelector('.thumbs-images') && document.querySelector('.images-object__slider')) {
		
		const galleryThumbs = new Swiper('.thumbs-images', {
			modules: [Navigation, Pagination, Autoplay, Thumbs, Controller],			
			centeredSlides: true,
			slidesPerView: 3,			
			spaceBetween: 5,
			touchRatio: 0.2,
			slideToClickedSlide: true,
			loop: true,
			loopedSlides: 4,
			breakpoints: {
				1200: {
					slidesPerView: 4,
					spaceBetween: 16,
				},
			},
		});

		const galleryTop = new Swiper('.images-object__slider', {
			modules: [Navigation, Pagination, Autoplay, Thumbs, Controller],
			spaceBetween: 10,
			navigation: {
				prevEl: ".images-object-button-prev",
				nextEl: ".images-object-button-next",
			},			
			loop: true,
			loopedSlides: 4
		});

		galleryTop.controller.control = galleryThumbs;
		galleryThumbs.controller.control = galleryTop;
		
		/*
		const thumbsSwiper = new Swiper(".thumbs-images", {
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Autoplay, Thumbs],
			spaceBetween: 10,
			centeredSlides: true,
			touchRatio: 0.2,
			slideToClickedSlide: true,
			loop: true,
			loopedSlides: 4,
			
			slidesPerView: 3,			
			spaceBetween: 5,
			speed: 800, 
			pagination: {
				el: ".products-new__dotts",
				clickable: true,
				dynamicBullets: true,
			},		

			breakpoints: {
				992: {
						slidesPerView: 3,
						spaceBetween: 5,
				},
				1330: {
						slidesPerView: 4,
						spaceBetween: 16,
				},
			},
			on: {},
		});

		new Swiper('.images-object__slider', {
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Autoplay, Thumbs],
			//effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			thumbs: {
				swiper: thumbsSwiper
			},
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: ".images-object-button-prev",
				nextEl: ".images-object-button-next",
			},
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 30,
			speed: 800,			
			on: {}
		});
		*/
	}
}

// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					//snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});