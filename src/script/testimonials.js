import swiperConfig from './testimonials.config';
import { KEY_ARROW_LEFT, KEY_ARROW_RIGHT, EVENT_KEYDOWN } from './constants';

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
    `.${swiperConfig.SLIDES_PREVIOUS_NAVIGATION_ELEMENT}`,
);
const testimonialNext = document.querySelector(
    `.${swiperConfig.SLIDES_NEXT_NAVIGATION_ELEMENT}`,
);

new Swiper('.swiper', {
    modules: [Navigation, Pagination, Autoplay, A11y, Keyboard],
    loop: swiperConfig.SLIDES_LOOP,
    slidesPerView: swiperConfig.SLIDES_PER_VIEW,
    spaceBetween: swiperConfig.SLIDES_GAP,
    speed: swiperConfig.SLIDES_TRANSITION_TIME,
    a11y: { enabled: swiperConfig.SLIDES_ACCESSIBILITY },
    pagination: {
        el: '.swiper-pagination',
        clickable: swiperConfig.SLIDES_PAGINATION_CLICKABILE,
    },
    navigation: {
        nextEl: `.${swiperConfig.SLIDES_NEXT_NAVIGATION_ELEMENT}`,
        prevEl: `.${swiperConfig.SLIDES_PREVIOUS_NAVIGATION_ELEMENT}`,
    },
    autoplay: {
        delay: swiperConfig.SLIDES_AUTOPLAY_DELAY,
        disableOnInteraction:
            swiperConfig.SLIDES_AUTOPLAY_INTERACTION_DISABILITY,
    },
    keyboard: {
        enabled: swiperConfig.SLIDES_KEYBOARD_CONTROL,
        onlyInViewport: swiperConfig.SLIDES_ONLY_IN_VIEWPORT,
    },
});

//Detect left and right keypress on the testimonial section only when focused
document.addEventListener(EVENT_KEYDOWN, (e) => {
    if (e.key === KEY_ARROW_RIGHT) testimonialNext.focus();
    else if (e.key === KEY_ARROW_LEFT) testimonialPrev.focus();
});
