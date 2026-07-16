import { currentTabEl } from './tabs.js';

export const TOAST_TYPES = {
    ERROR: 'Error',
    ALERT: 'Alert',
    WARN: 'Warning',
};

export function showToast(message, type) {
    const element = createToastElement(message, type);

    document.body.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 2000);
}

function createToastElement(message, type) {
    const containerEl = document.createElement('div');
    containerEl.classList.add('toast-el');

    const messageHolder = document.createElement('div');
    messageHolder.classList.add('toast-message-holder');
    messageHolder.textContent = message;

    containerEl.append(messageHolder);

    return containerEl;
}
