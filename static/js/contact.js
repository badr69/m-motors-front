import { api, ENDPOINTS } from './api.js';
import { Validator, Security, handleSubmitButton, handleLiveFeedback } from './utils.js';

export function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const feedback = form.querySelector('.feedback');

    handleSubmitButton('#contact-form', 'button[type="submit"]');
    handleLiveFeedback('#contact-form', '.feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.textContent = '';

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            feedback.style.color = 'red';
            feedback.textContent = 'Veuillez remplir tous les champs';
            return;
        }

        if (!Validator.isValidEmail(email)) {
            feedback.style.color = 'red';
            feedback.textContent = 'Email invalide';
            return;
        }

        if (Validator.detectSqlInjection(name + email + message)) {
            feedback.style.color = 'red';
            feedback.textContent = 'Entrée invalide détectée';
            return;
        }

        const cleanName = Security.sanitizeHtml(name);
        const cleanMessage = Security.sanitizeHtml(message);

        const { status, data } = await api(ENDPOINTS.CONTACT, 'POST', {
            name: cleanName,
            email,
            message: cleanMessage
        });

        if (status === 200) {
            feedback.style.color = 'green';
            feedback.textContent = 'Message envoyé ✅';
            form.reset();
        } else {
            feedback.style.color = 'red';
            feedback.textContent = data.error || 'Erreur envoi';
        }
    });
}
