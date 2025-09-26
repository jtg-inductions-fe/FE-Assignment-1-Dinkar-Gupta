import * as config from './config';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
    Navigation,
    Pagination,
    Autoplay,
    A11y,
    Keyboard,
} from 'swiper/modules';

const testimonialPrev = document.querySelector(
    `.${config.SLIDES_PREVIOUS_NAVIGATION_ELEMENT}`,
);
const testimonialNext = document.querySelector(
    `.${config.SLIDES_NEXT_NAVIGATION_ELEMENT}`,
);

new Swiper('.swiper', {
    modules: [Navigation, Pagination, Autoplay, A11y, Keyboard],
    loop: config.SLIDES_LOOP,
    slidesPerView: config.SLIDES_PER_VIEW,
    spaceBetween: config.SLIDES_GAP,
    speed: config.SLIDES_TRANSITION_TIME,
    a11y: { enabled: config.SLIDES_ACCESSIBILITY },
    pagination: {
        el: '.swiper-pagination',
        clickable: config.SLIDES_PAGINATION_CLICKABILE,
    },
    navigation: {
        nextEl: `.${config.SLIDES_NEXT_NAVIGATION_ELEMENT}`,
        prevEl: `.${config.SLIDES_PREVIOUS_NAVIGATION_ELEMENT}`,
    },
    autoplay: {
        delay: config.SLIDES_AUTOPLAY_DELAY,
        disableOnInteraction: config.SLIDES_AUTOPLAY_INTERACTION_DISABILITY,
    },
    keyboard: {
        enabled: config.SLIDES_KEYBOARD_CONTROL,
        onlyInViewport: config.SLIDES_ONLY_IN_VIEWPORT,
    },
});

//Detect left and right keypress on the testimonial section only when focused
document.addEventListener(config.SLIDES_NAVIGATION_EVENT, (e) => {
    if (e.key === config.SLIDES_NEXT_CONTROLLER) testimonialNext.focus();
    else if (e.key === config.SLIDES_PREVIOUS_CONTROLLER)
        testimonialPrev.focus();
});
