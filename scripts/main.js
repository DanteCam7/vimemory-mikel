import { buildMailtoUrl, isValidEmail } from './forms.js';

const SCROLL_OFFSET = 8;
const REVEAL_THRESHOLD = 0.12;
const APP_ORIGIN = 'http://localhost:4203';
const APP_LINKS_ENABLED = false;
const CONTACT_EMAIL = 'hola@vimemory.com';

function markJsAvailable() {
	document.documentElement.classList.remove('no-js');
	document.documentElement.classList.add('has-js');
}

function bindNavbarScroll() {
	const navbar = document.getElementById('navbar');
	const update = () => navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_OFFSET);
	update();
	window.addEventListener('scroll', update, { passive: true });
}

function bindDrawer() {
	const hamburger = document.getElementById('hamburger');
	const drawer = document.getElementById('drawer');

	const setOpen = (isOpen) => {
		hamburger.setAttribute('aria-expanded', String(isOpen));
		hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
		drawer.classList.toggle('is-open', isOpen);
		drawer.hidden = !isOpen;
	};

	hamburger.addEventListener('click', () => {
		setOpen(hamburger.getAttribute('aria-expanded') !== 'true');
	});

	drawer.addEventListener('click', (event) => {
		if (event.target.closest('a')) {
			setOpen(false);
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			setOpen(false);
		}
	});
}

function bindReveals() {
	const targets = document.querySelectorAll('.reveal');
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion || !('IntersectionObserver' in window)) {
		targets.forEach((target) => target.classList.add('is-revealed'));
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-revealed');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: REVEAL_THRESHOLD });

	targets.forEach((target) => observer.observe(target));
}

function bindAppLinks() {
	if (!APP_LINKS_ENABLED) {
		return;
	}

	document.querySelectorAll('[data-app-link]').forEach((link) => {
		link.href = `${APP_ORIGIN}${link.dataset.appLink}`;
	});
}

function bindContactForm() {
	const form = document.getElementById('contact-form');
	const status = document.getElementById('contact-status');

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const name = document.getElementById('contact-name').value.trim();
		const email = document.getElementById('contact-email').value.trim();
		const message = document.getElementById('contact-message').value.trim();

		if (!name || !message) {
			status.classList.remove('is-ok');
			status.textContent = 'Completa tu nombre y tu mensaje.';
			return;
		}

		if (!isValidEmail(email)) {
			status.classList.remove('is-ok');
			status.textContent = 'Revisa tu correo electrónico.';
			return;
		}

		status.classList.add('is-ok');
		status.textContent = 'Abriendo tu cliente de correo…';
		window.location.href = buildMailtoUrl({ to: CONTACT_EMAIL, name, email, message });
	});
}

function bindNewsletterForm() {
	const form = document.getElementById('newsletter-form');
	const input = document.getElementById('newsletter-email');
	const status = document.getElementById('newsletter-status');

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		if (!isValidEmail(input.value)) {
			status.classList.remove('is-ok');
			status.textContent = 'Revisa tu correo electrónico.';
			return;
		}

		status.classList.add('is-ok');
		status.textContent = 'Vista previa: la suscripción aún no está conectada.';
		input.value = '';
	});
}

markJsAvailable();
document.addEventListener('DOMContentLoaded', () => {
	bindNavbarScroll();
	bindDrawer();
	bindReveals();
	bindAppLinks();
	bindContactForm();
	bindNewsletterForm();
});
