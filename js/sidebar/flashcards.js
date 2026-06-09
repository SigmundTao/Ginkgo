const ROOT_STATES = {
  packlist: 'packList',
  cardlist: 'cardList',
  study: 'study',
}

function createState() {
  return {
    packs: JSON.parse(localStorage.getItem('flashcards')) || [],
    view: 'packList',
    activePack: null,
    currentCard: null,
  };
}

function save(state) {
  localStorage.setItem('flashcards', JSON.stringify(state.packs));
}

export function createFlashcardModule(isInSidebar = false) {
  const state = createState();
  const root = document.createElement('div');
  root.id = 'flashcard-root';
  render(root, state, isInSidebar);
  return root;
}

function render(root, state, isInSidebar = false) {
  root.innerHTML = '';
  if (state.view === ROOT_STATES.packlist) renderPackList(root, state, isInSidebar);
  if (state.view === ROOT_STATES.cardlist) renderCardList(root, state, isInSidebar);
  if (state.view === ROOT_STATES.study) renderStudyView(root, state, isInSidebar);
}

function renderPackList(root, state, isInSidebar) {
  const title = document.createElement('h3');
  title.textContent = 'My Packs';
  root.appendChild(title);

  state.packs.forEach((pack, index) => {
    const packEl = document.createElement('div');
    packEl.classList.add('flashcard-pack-element');
    packEl.textContent = pack.title;
    packEl.addEventListener('click', () => {
      state.activePack = index;
      state.view = isInSidebar ? ROOT_STATES.study : ROOT_STATES.cardlist;
      render(root, state, isInSidebar);
    });
    root.appendChild(packEl);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.addEventListener('click', () => promptNewPack(root, state, isInSidebar));
  root.appendChild(addBtn);
}

function renderCardList(root, state, isInSidebar) {
  const pack = state.packs[state.activePack];

  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', () => {
    state.view = ROOT_STATES.packlist;
    render(root, state, isInSidebar);
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
  addCardBtn.addEventListener('click', () => promptNewCard(root, state, pack, isInSidebar));
  root.appendChild(addCardBtn);
}

function renderStudyView(root, state, isInSidebar) {
  state.currentCard = 0;
  const pack = state.packs[state.activePack];
  
  const packTitle = document.createElement('h3');
  packTitle.textContent = pack.title;
  root.appendChild(packTitle);

  const flashcardDisplayEl = document.createElement('div');
  flashcardDisplayEl.classList.add('flashcard-display-el');
  root.appendChild(flashcardDisplayEl);

  const flashcardEl = document.createElement('div');
  flashcardEl.classList.add('flashcard');

  const backBtn = document.createElement('div');
  backBtn.classList.add('flashcard-nav-btn');
  backBtn.style.backgroundImage = `url('../../assets/leftarrow.svg')`;
  backBtn.addEventListener('click', () => {
    if (state.currentCard <= 0) return;
    state.currentCard--;
    createFlashcard(pack.cards[state.currentCard], flashcardEl);
  });

  const forwardBtn = document.createElement('div');
  forwardBtn.classList.add('flashcard-nav-btn');
  forwardBtn.style.backgroundImage = `url('../../assets/rightarrow.svg')`;
  forwardBtn.addEventListener('click', () => {
    if (state.currentCard >= pack.cards.length - 1) return;
    state.currentCard++;
    createFlashcard(pack.cards[state.currentCard], flashcardEl);
  });

  const returnBtn = document.createElement('button');
  returnBtn.textContent = '← Back';
  returnBtn.addEventListener('click', () => {
    state.view = ROOT_STATES.packlist;
    render(root, state, isInSidebar);
  });

  root.appendChild(returnBtn);
  flashcardDisplayEl.appendChild(backBtn);
  flashcardDisplayEl.appendChild(flashcardEl);
  flashcardDisplayEl.appendChild(forwardBtn);

  if(pack.cards.length) createFlashcard(pack.cards[state.currentCard], flashcardEl);
  else flashcardEl.textContent = 'This pack has no cards. Go to flashcards in settings to add some';
}

function createFlashcard(card, element) {
  element.innerHTML = '';
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  element.appendChild(cardContainer);

  const frontOfCard = document.createElement('div');
  frontOfCard.classList.add('card-front');
  frontOfCard.textContent = card.front;
  cardContainer.appendChild(frontOfCard);

  const backOfCard = document.createElement('div');
  backOfCard.classList.add('card-back');
  backOfCard.textContent = card.back;
  cardContainer.appendChild(backOfCard);

  element.onclick = () => {
    cardContainer.classList.toggle('flipped');
  };
}

function promptNewPack(root, state, isInSidebar) {
  const input = document.createElement('input');
  input.placeholder = 'Pack name...';
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      state.packs.push({ title: input.value.trim(), cards: [] });
      save(state);
      render(root, state, isInSidebar);
    }
    if (e.key === 'Escape') render(root, state, isInSidebar);
  });
  root.appendChild(input);
  input.focus();
}

function promptNewCard(root, state, pack, isInSidebar) {
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
      save(state);
      render(root, state, isInSidebar);
    }
  });

  root.append(frontInput, backInput, confirmBtn);
  frontInput.focus();
}
