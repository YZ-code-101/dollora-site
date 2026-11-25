const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('details').forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});

const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');

form.addEventListener('submit', event => {
  event.preventDefault();
  status.className = 'form-status';

  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Please complete the required fields before creating your email.';
    status.classList.add('error');
    return;
  }

  const data = new FormData(form);
  const features = data.getAll('features');
  const files = form.elements.references.files;
  const fileNames = [...files].map(file => file.name).join(', ');
  const body = [
    'Hello DOLLORA,',
    '',
    'I would like to begin a personalized art doll inquiry.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `This doll is: ${data.get('recipient')}`,
    `Personalization interests: ${features.length ? features.join(', ') : 'Not selected'}`,
    '',
    'My story / idea:',
    data.get('story'),
    '',
    fileNames ? `Reference files to attach manually: ${fileNames}` : 'Reference files: None selected',
    '',
    'I understand this is an early, non-binding inquiry and not a confirmed order.',
    '',
    'Thank you.'
  ].join('\n');

  const subject = `DOLLORA inquiry — ${data.get('name')}`;
  status.textContent = 'Your email app should open now. Please attach any reference photos manually before sending.';
  window.location.href = `mailto:hello@dollora.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
