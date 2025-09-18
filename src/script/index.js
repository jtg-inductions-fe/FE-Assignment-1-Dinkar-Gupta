import '../styles/main.scss';
('use strict');

//HEADER NAVIGATION LOGIC

/**
 * The main header element.
 * @type {HTMLElement}
 */
const header = document.querySelector('.header');

/**
 * Navigation drawer element.
 * @type {HTMLElement}
 */
const navDrawer = document.querySelector('.header__nav-links');

/**
 * Navigation menu button element.
 * @type {HTMLElement}
 */
const navMenu = document.querySelector('.header__menu');

/**
 * Menu icon element.
 * @type {HTMLElement}
 */
const menuIcon = document.querySelector('.icon-menu2');

/**
 * Close icon element.
 * @type {HTMLElement}
 */
const closeIcon = document.querySelector('.icon-close');

/**
 * Media query match for desktop screens.
 * @returns {boolean} True if viewport width is 1025px or wider.
 */
const isDesktop = () => window.matchMedia('(min-width: 1025px)').matches;

/**
 * Keydown event handler for focus trap and escape key.
 * @type {function|null}
 */
let handler = null;

/**
 * Stores timeout for clearing visible hidden
 */
let navDrawerClosingTimeout = null;

/**
 * Toggles the visibility of the drawer and icons.
 */
const toggle = () => {
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    navDrawer.classList.toggle('open-drawer');
};

/**
 * Adds keyboard focus trap within the nav drawer.
 * Handles Tab, Shift+Tab, and Escape key for accessibility.
 */
const trapFocus = () => {
    handler = (e) => {
        const focusableEls = [...navDrawer.querySelectorAll('a'), navMenu];
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        if (e.key === 'Tab') {
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
        if (e.key === 'Escape') {
            closeDrawer();
            toggle();
        }
    };
    header.addEventListener('keydown', handler);
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
    navDrawer.removeAttribute('inert');

    navDrawer.classList.remove('hide');
    if (navDrawerClosingTimeout) clearTimeout(navDrawerClosingTimeout);
    trapFocus();
    const overlay = document.body.querySelector('.overlay');
    overlay.addEventListener('click', () => {
        closeDrawer();
        toggle();
    });
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
    const overlay = document.body.querySelector('.overlay');
    if (overlay) overlay.remove();
    scrollBlock(0);

    //Only hide navDrawer after exit animation
    navDrawerClosingTimeout = setTimeout(() => {
        navDrawer.classList.add('hide');
    }, 500);

    navDrawer.setAttribute('inert', '');
    if (handler) {
        header.removeEventListener('keydown', handler);
        handler = null;
    }
}

// On desktop, remove accessibility blockers by default.
if (isDesktop()) {
    navDrawer.classList.remove('hide');
    navDrawer.removeAttribute('inert');
}

// Remove accessibility blockers on resize to desktop.
window.addEventListener('resize', () => {
    if (isDesktop()) {
        navDrawer.classList.remove('hide');
        navDrawer.removeAttribute('inert');
    } else {
        navDrawer.classList.add('hide');
    }
});

//close drawer if a link is clicked
navDrawer.addEventListener('click', (e) => {
    if (e.target.closest('li')) {
        toggle();
        closeDrawer();
    }
});

// Event listener to toggle drawer on menu click.
navMenu.addEventListener('click', toggleDrawer);
