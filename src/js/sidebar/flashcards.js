import { USER, updateUserData } from '../user.js';

const ROOT_STATES = {
    packlist: 'packList',
    cardlist: 'cardList',
    study: 'study',
};

const FLASHCARD_COLOURS = [
    { bg: '#FFF9C4', text: '#5D4E00' }, // soft yellow
    { bg: '#FFE0B2', text: '#5D2E00' }, // peach
    { bg: '#F8BBD0', text: '#5D0030' }, // blush pink
    { bg: '#E1BEE7', text: '#3E0059' }, // lavender
    { bg: '#C5CAE9', text: '#1A237E' }, // periwinkle
    { bg: '#B3E5FC', text: '#01294E' }, // sky blue
    { bg: '#B2EBF2', text: '#00363A' }, // aqua
    { bg: '#C8E6C9', text: '#1B5E20' }, // mint green
    { bg: '#DCEDC8', text: '#33691E' }, // sage
    { bg: '#F0F4C3', text: '#524C00' }, // light lime
    { bg: '#FFE0CC', text: '#5C2100' }, // apricot
    { bg: '#FFD6D6', text: '#5C0000' }, // rose
    { bg: '#D7CCC8', text: '#3E2723' }, // warm greige
    { bg: '#F5F5F5', text: '#212121' }, // cool white
    { bg: '#E8F5E9', text: '#1B5E20' }, // pale green
    { bg: '#EDE7F6', text: '#311B92' }, // soft violet
    { bg: '#FCE4EC', text: '#880E4F' }, // petal
    { bg: '#E3F2FD', text: '#0D47A1' }, // pale blue
    { bg: '#FFF3E0', text: '#E65100' }, // cream orange
    { bg: '#E0F7FA', text: '#006064' }, // pale teal
];

function createState() {
    return {
        packs: USER.settings.flashcards.packs,
        view: 'packList',
        activePack: null,
        currentCard: null,
        openInTab: false,
    };
}

export function createFlashcardModule() {
    const state = createState();
    const root = document.createElement('div');
    root.classList.add('flashcard-module');
    root.id = 'flashcard-root';
    render(root, state);
    return root;
}

function render(root, state) {
    root.innerHTML = '';
    if (state.view === ROOT_STATES.packlist) renderPackList(root, state);
    if (state.view === ROOT_STATES.cardlist) renderCardList(root, state);
    if (state.view === ROOT_STATES.study) renderStudyView(root, state);
}

function renderPackList(root, state) {
    const title = document.createElement('h3');
    title.textContent = 'My Packs:';

    const packContainer = document.createElement('div');
    packContainer.classList.add('pack-list-pack-container');

    USER.settings.flashcards.packs.forEach((pack, index) => {
        const packEl = document.createElement('div');
        packEl.classList.add('flashcard-pack-element');
        packEl.textContent = pack.title;

        const deletePackBtn = document.createElement('button');
        deletePackBtn.textContent = 'x';
        deletePackBtn.classList.add('delete-pack-btn');
        deletePackBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            deletePack(root, state, index)
        });
        packEl.append(deletePackBtn);

        packEl.addEventListener('click', () => {
            state.activePack = index;
            state.view = ROOT_STATES.cardlist;
            render(root, state);
        });
        packContainer.appendChild(packEl);
    });

    const btnInputContainer = document.createElement('div');
    btnInputContainer.classList.add('btn-input-container');

    const addBtn = document.createElement('button');
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => promptNewPack(root, state, btnInputContainer));
    addBtn.classList.add('pack-list-add-btn');
    btnInputContainer.append(addBtn);
    root.append(title, packContainer, btnInputContainer);
}

function deletePack(root, state, packIndex) {
    USER.settings.flashcards.packs.splice(packIndex, 1);
    state.activePack = null;
    updateUserData()
    render(root, state)
}

function renderCardList(root, state) {
    const pack = USER.settings.flashcards.packs[state.activePack];

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', () => {
        state.view = ROOT_STATES.packlist;
        render(root, state);
    });
    root.appendChild(backBtn);

    const studyBtn = document.createElement('button');
    studyBtn.textContent = 'Study';
    studyBtn.addEventListener('click', () => {
        state.currentCard = 0;
        state.view = ROOT_STATES.study;
        render(root, state);
    });
    root.appendChild(studyBtn);

    const title = document.createElement('h3');
    title.textContent = pack.title;
    root.appendChild(title);

    pack.cards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('flashcard-card-element');

        const cardText = document.createElement('p');
        cardText.textContent = `${card.front} → ${card.back}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.addEventListener('click', () => {
            deleteCard(card.front, state, root);
        });

        cardEl.append(cardText, deleteBtn);
        root.appendChild(cardEl);
    });

    const addCardBtn = document.createElement('button');
    addCardBtn.textContent = '+ Add Card';
    addCardBtn.addEventListener('click', () => promptNewCard(root, state, pack));
    root.appendChild(addCardBtn);
}

function deleteCard(cardFront, state, root) {
    const cards = USER.settings.flashcards.packs[state.activePack].cards;
    const index = cards.findIndex((card) => card.front === cardFront);
    USER.settings.flashcards.packs[state.activePack].cards.splice(index, 1);
    updateUserData();
    render(root, state);
}

function renderStudyView(root, state) {
    const pack = USER.settings.flashcards.packs[state.activePack];

    const packTitle = document.createElement('h3');
    packTitle.classList.add('pack-title');
    packTitle.textContent = pack.title;
    root.appendChild(packTitle);

    const flashcardDisplayEl = document.createElement('div');
    flashcardDisplayEl.classList.add('flashcard-display-el');
    root.appendChild(flashcardDisplayEl);

    const flashcardEl = document.createElement('div');
    flashcardEl.classList.add('flashcard');

    const flashcardBtnHolder = document.createElement('div');
    flashcardBtnHolder.classList.add('flashcard-btn-holder');

    const backBtn = document.createElement('div');
    backBtn.classList.add('flashcard-nav-btn');
    backBtn.style.backgroundImage = `url('src/assets/leftarrow.svg')`;
    flashcardBtnHolder.appendChild(backBtn);
    backBtn.addEventListener('click', () => {
        if (state.currentCard <= 0) return;
        state.currentCard--;
        createFlashcard(pack.cards[state.currentCard], flashcardEl);
    });

    const forwardBtn = document.createElement('div');
    forwardBtn.classList.add('flashcard-nav-btn');
    forwardBtn.style.backgroundImage = `url('src/assets/rightarrow.svg')`;
    flashcardBtnHolder.appendChild(forwardBtn);
    forwardBtn.addEventListener('click', () => {
        if (state.currentCard >= pack.cards.length - 1) return;
        state.currentCard++;
        createFlashcard(pack.cards[state.currentCard], flashcardEl);
    });

    const returnBtn = document.createElement('button');
    returnBtn.textContent = '← Back';
    returnBtn.addEventListener('click', () => {
        state.view = ROOT_STATES.packlist;
        render(root, state);
    });

    root.appendChild(returnBtn);
    flashcardDisplayEl.appendChild(flashcardEl);
    flashcardDisplayEl.appendChild(flashcardBtnHolder);

    if (pack.cards.length) createFlashcard(pack.cards[state.currentCard], flashcardEl);
    else flashcardEl.textContent ='This pack has no cards.';
}

function createFlashcard(card, element) {
    element.innerHTML = '';
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    element.appendChild(cardContainer);
    colourFlashcard(cardContainer);

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

function promptNewPack(root, state, container) {
    const input = document.createElement('input');
    input.classList.add('pack-name-input');
    input.placeholder = 'Pack name...';
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            USER.settings.flashcards.packs.push({ title: input.value.trim(), cards: [] });
            updateUserData();
            render(root, state);
        }
        if (e.key === 'Escape') render(root, state);
    });
    container.appendChild(input);
    input.focus();
}

function promptNewCard(root, state, pack) {
    const frontInput = document.createElement('input');
    frontInput.placeholder = 'Front...';

    const backInput = document.createElement('input');
    backInput.placeholder = 'Back...';

    frontInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            backInput.focus();
        }
    });

    backInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        saveCard(root, state, frontInput.value.trim(), backInput.value.trim(), pack);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Add';
    confirmBtn.addEventListener('click', () => {
        saveCard(root, state, frontInput.value.trim(), backInput.value.trim(), pack);
    });

    root.append(frontInput, backInput, confirmBtn);
    frontInput.focus();
}

function saveCard(root, state, front, back, pack) {
    if (front && back) {
        pack.cards.push({ front, back });
        updateUserData();
        render(root, state);
    }
}

function colourFlashcard(cardEl) {
    const colourCombo = FLASHCARD_COLOURS[randomNumberWithinRange(FLASHCARD_COLOURS.length - 1)];

    cardEl.style.backgroundColor = colourCombo.bg;
    cardEl.style.color = colourCombo.text;
}

function randomNumberWithinRange(range) {
    return Math.floor(Math.random() * range);
}
