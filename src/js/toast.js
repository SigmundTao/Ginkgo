import { currentTabEl } from './tabs.js';

export function showToast(message, type) {
  const element = createToastElement(message, type);

  currentTabEl.appendChild(element)

  setTimeout(() => {
    element.remove()
  }, 2000)
}

function createToastElement(message, type) {
  const containerEl = document.createElement('div');
  containerEl.classList.add('toast-el');

  const typeHolder = document.createElement('div');
  typeHolder.textContent = type;
  typeHolder.classList.add('toast-type-holder');

  const messageHolder = document.createElement('div');
  messageHolder.classList.add('toast-message-holder');
  messageHolder.textContent = message;

  containerEl.append(typeHolder, messageHolder)

  return containerEl;
}
