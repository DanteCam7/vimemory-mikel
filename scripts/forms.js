const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
	return EMAIL_PATTERN.test(String(value).trim());
}

export function buildMailtoUrl({ to, name, email, message }) {
	const subject = `Contacto desde el sitio — ${name}`;
	const body = `Nombre: ${name}\nCorreo: ${email}\n\n${message}`;
	return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
