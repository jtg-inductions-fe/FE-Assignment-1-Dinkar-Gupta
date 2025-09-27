import { keys, attributes, events } from '../constants';
import headerConfig from './header.config';

const header = document.querySelector('.header');
const navDrawer = document.querySelector('.header__nav-links');
const navMenu = document.querySelector('.header__menu');
const closeIcon = document.querySelector('.icon-close');
const menuIcon = document.querySelector('.icon-menu2');
const isDesktop = () => window.matchMedia('(min-width: 1025px)').matches;
let handler = null;
let navDrawerClosingTimeout = null;

/**
 * Toggles the visibility of the drawer and icons.
 */
const toggle = () => {
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    navDrawer.classList.toggle('open-drawer');
};

window.addEventListener(events.SCROLL, () => {
    if (window.scrollY > 0) {
        header.classList.add('add-shadow');
    } else {
        header.classList.remove('add-shadow');
    }
});

/**
 * Adds keyboard focus trap within the nav drawer.
 * Handles Tab, Shift+Tab, and Escape key for accessibility.
 */
const trapFocus = () => {
    handler = (e) => {
        const focusableEls = [
            ...navDrawer.querySelectorAll(
                'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
            ),
            navMenu,
        ];

        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        if (e.key === keys.TAB) {
            if (e.shiftKey && document.activeElement === firstFocusableEl) {
                e.preventDefault();
                lastFocusableEl.focus();
            } else if (
                !e.shiftKey &&
                document.activeElement === lastFocusableEl
            ) {
                e.preventDefault();
                firstFocusableEl.focus();
            }
        }
        if (e.key === keys.ESCAPE) {
            closeDrawer();
            toggle();
        }
    };
    header.addEventListener(events.KEYDOWN, handler);
};

/**
 * Enables or disables scroll blocking on the page by toggling a CSS class.
 *
 * This function adds or removes the `scroll-block` class on both `<html>` and `<body>`,
 * depending on the `state` provided. It's typically used to prevent background
 * scrolling when modals, drawers, or mobile nav menus are open.
 *
 * @param {boolean} state - If `true`, scroll is blocked. If `false`, scroll is restored.
 */

const scrollBlock = (state) => {
    if (state) {
        document.documentElement.classList.add('scroll-block');
        document.body.classList.add('scroll-block');
    } else {
        document.documentElement.classList.remove('scroll-block');
        document.body.classList.remove('scroll-block');
    }
};

/**
 * Opens the navigation drawer, sets up overlay and traps focus.
 */
const openDrawer = () => {
    document.body.insertAdjacentHTML(
        'afterbegin',
        '<div class="overlay"></div>',
    );

    scrollBlock(1);

    if (!isDesktop()) {
        navMenu.setAttribute(attributes.ARIA_LABEL, 'Close Menu');
        navMenu.setAttribute(attributes.ARIA_EXPANDED, true);
        navDrawer.removeAttribute(attributes.INERT);
        navDrawer.classList.remove('hide');
        if (navDrawerClosingTimeout) clearTimeout(navDrawerClosingTimeout);
        trapFocus();
        const overlay = document.body.querySelector('.overlay');
        overlay.addEventListener(events.CLICK, () => {
            closeDrawer();
            toggle();
        });
    }
};

/**
 * Toggles drawer open/close state.
 */
const toggleDrawer = () => {
    toggle();
    if (navDrawer.classList.contains('open-drawer')) openDrawer();
    else closeDrawer();
};

/**
 * Closes the navigation drawer, removes overlay and resets accessibility.
 */
function closeDrawer() {
    navMenu.setAttribute(attributes.ARIA_EXPANDED, 'false');
    const overlay = document.body.querySelector('.overlay');
    overlay.remove();
    scrollBlock(0);

    //Only hide navDrawer after exit animation
    if (!isDesktop()) {
        navMenu.setAttribute(attributes.ARIA_LABEL, 'Open Menu');
        navMenu.setAttribute(attributes.ARIA_EXPANDED, false);
        navDrawerClosingTimeout = setTimeout(() => {
            navDrawer.classList.add('hide');
        }, headerConfig.DRAWER_TRANSITION_TIME);
        navDrawer.setAttribute(attributes.INERT, '');
        if (handler) {
            header.removeEventListener(events.KEYDOWN, handler);
            handler = null;
        }
    }
}

// On desktop, remove accessibility blockers by default.
if (isDesktop()) {
    navDrawer.classList.remove('hide');
    navDrawer.removeAttribute(attributes.INERT);
}

// Remove accessibility blockers on resize to desktop and add in case drawer is open on mobile or tab
window.addEventListener('resize', () => {
    if (isDesktop()) {
        navDrawer.classList.remove('hide');
        navDrawer.removeAttribute(attributes.INERT);
    } else {
        if (!navDrawer.classList.contains('open-drawer')) {
            navDrawer.classList.add('hide');
            navDrawer.setAttribute(attributes.INERT, '');
        }
    }
});

//Close drawer if a link is clicked
navDrawer.addEventListener(events.CLICK, (e) => {
    if (e.target.closest('li')) {
        toggle();
        closeDrawer();
    }
});

navMenu.addEventListener(events.CLICK, toggleDrawer);
