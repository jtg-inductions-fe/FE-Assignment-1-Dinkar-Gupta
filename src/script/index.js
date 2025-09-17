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
const menuIcon = document.querySelector('.icon-menu');

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
 * Removes accessibility blockers on nav drawer
 * such as `aria-hidden` and `inert` attributes.
 */
const removeAccessibilityBlockers = () => {
    navDrawer.removeAttribute('aria-hidden');
    navDrawer.removeAttribute('inert');
};

/**
 * Opens the navigation drawer, sets up overlay and traps focus.
 */
const openDrawer = () => {
    document.body.insertAdjacentHTML(
        'afterbegin',
        '<div class="overlay"></div>',
    );
    removeAccessibilityBlockers();
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
    navDrawer.setAttribute('aria-hidden', 'true');
    navDrawer.setAttribute('inert', '');
    if (handler) {
        header.removeEventListener('keydown', handler);
        handler = null;
    }
}

// On desktop, remove accessibility blockers by default.
if (isDesktop()) {
    removeAccessibilityBlockers();
}

// Remove accessibility blockers on resize to desktop.
window.addEventListener('resize', () => {
    if (isDesktop()) {
        removeAccessibilityBlockers();
    }
});

// Event listener to toggle drawer on menu click.
navMenu.addEventListener('click', toggleDrawer);
