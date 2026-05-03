export const Validator = {
  isValidEmail: (email) => /\S+@\S+\.\S+/.test(email),

  isValidUsername: (username) =>
    username.length >= 3 && username.length <= 12,

  isStrongPassword: (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
};

export const Security = {
  sanitizeHtml: (input) => {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  }
};

// ======================
// BUTTON DISABLE / ENABLE
// ======================
export function handleSubmitButton(formSelector, submitSelector) {
  const form = document.querySelector(formSelector);
  const btn = document.querySelector(submitSelector);

  if (!form || !btn) return;

  btn.disabled = true;

  form.addEventListener('input', () => {
    let hasValue = false;

    for (const el of form.elements) {
      if (el.type !== 'submit' && el.value?.trim()) {
        hasValue = true;
        break;
      }
    }

    btn.disabled = !hasValue;
  });
}

// ======================
// LIVE FEEDBACK (IMPORTANT FIX)
// ======================
export function handleLiveFeedback(formSelector, feedbackSelector) {
  const form = document.querySelector(formSelector);
  const feedback = document.querySelector(feedbackSelector);

  if (!form || !feedback) return;

  form.addEventListener('input', () => {
    const messages = [];

    for (const el of form.elements) {
      if (el.tagName !== 'INPUT') continue;

      const val = el.value.trim();

      if (el.name === 'username' && !Validator.isValidUsername(val)) {
        messages.push('Username: 3 à 12 caractères');
      }

      if (el.name === 'email' && !Validator.isValidEmail(val)) {
        messages.push('Email invalide');
      }

      if (el.name === 'password' && !Validator.isStrongPassword(val)) {
        messages.push('Mot de passe faible');
      }
    }

    feedback.textContent = messages.join(' | ');
    feedback.style.color = messages.length ? 'red' : 'green';
  });
}