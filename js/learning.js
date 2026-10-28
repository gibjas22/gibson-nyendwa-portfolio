// Progressive enhancement: all learning stays readable without JavaScript.
const section = document.getElementById('learning');
if (section) {
  const controls = section.querySelector('.learning-controls');
  const status = section.querySelector('#learning-status');
  const buttons = [...section.querySelectorAll('[data-learning-filter]')];
  const cards = [...section.querySelectorAll('[data-learning-topic]')];
  const apply = button => {
    const topic = button.dataset.learningFilter;
    let shown = 0;
    cards.forEach(card => {
      card.hidden = topic !== 'all' && card.dataset.learningTopic !== topic;
      if (!card.hidden) shown++;
    });
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    status.textContent = topic === 'all'
      ? `Showing all ${shown} learning areas`
      : `Showing ${shown} ${shown === 1 ? 'learning area' : 'learning areas'} in ${button.textContent}`;
  };
  if (controls && status && buttons.length) {
    controls.hidden = false;
    controls.addEventListener('click', event => {
      const button = event.target.closest('[data-learning-filter]');
      if (button && controls.contains(button)) apply(button);
    });
    apply(buttons[0]);
  }
}
