import { updateFlashcardData } from "../storage.js";

export let state = {
  packs: JSON.parse(localStorage.getItem('flashcards')) || [],
  view: 'packList',   // 'packList' | 'cardList' | 'study'
  activePack: null,
};

function save() {
  localStorage.setItem('flashcards', JSON.stringify(state.packs));
  updateFlashcardData();
}

export function createFlashcardModule() {
  const root = document.createElement('div');
  root.id = 'flashcard-root';
  render(root);
  return root;
}

function render(root) {
  root.innerHTML = '';
  if (state.view === 'packList') renderPackList(root);
  if (state.view === 'cardList') renderCardList(root);
}

function renderPackList(root) {
  const title = document.createElement('h3');
  title.textContent = 'My Packs';
  root.appendChild(title);

  state.packs.forEach((pack, index) => {
    const packEl = document.createElement('div');
    packEl.classList.add('flashcard-pack-element');
    packEl.textContent = pack.title;
    packEl.addEventListener('click', () => {
      state.activePack = index;
      state.view = 'cardList';
      render(root);
    });
    root.appendChild(packEl);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.addEventListener('click', () => promptNewPack(root));
  root.appendChild(addBtn);
}

function renderCardList(root) {
  const pack = state.packs[state.activePack];

  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', () => {
    state.view = 'packList';
    render(root);
  });
  root.appendChild(backBtn);

  const title = document.createElement('h3');
  title.textContent = pack.title;
  root.appendChild(title);

  pack.cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('flashcard-card-element');
    cardEl.textContent = `${card.front} → ${card.back}`;
    root.appendChild(cardEl);
  });

  const addCardBtn = document.createElement('button');
  addCardBtn.textContent = '+ Add Card';
  addCardBtn.addEventListener('click', () => promptNewCard(root, pack));
  root.appendChild(addCardBtn);
}

function promptNewPack(root) {
  const input = document.createElement('input');
  input.placeholder = 'Pack name...';
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      state.packs.push({ title: input.value.trim(), cards: [] });
      save();
      render(root);  // re-render wipes the input automatically
    }
    if (e.key === 'Escape') render(root);
  });
  root.appendChild(input);
  input.focus();
}

function promptNewCard(root, pack) {
  const frontInput = document.createElement('input');
  frontInput.placeholder = 'Front...';
  const backInput = document.createElement('input');
  backInput.placeholder = 'Back...';

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Add';
  confirmBtn.addEventListener('click', () => {
    const front = frontInput.value.trim();
    const back = backInput.value.trim();
    if (front && back) {
      pack.cards.push({ front, back });
      save();
      render(root);
    }
  });

  root.append(frontInput, backInput, confirmBtn);
  frontInput.focus();
}
