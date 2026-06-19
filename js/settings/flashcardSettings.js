import { USER, updateUserData } from '../user.js';

function createFlashcardSettings(){
  const container = document.createElement('div');
  
  const title = document.createElement('h3');
  title.textContent = 'Flashcards';

  return container;
}

function renderPackView(){
  const title = document.createElement('h4');
  title.textContent = 'My Packs:';

  const packs = USER.settings.flashcards.packs;
}

class Pack {
  constructor(title){

    this.title = title;
    this.cards = [];
  }

  createElement(){
    const packElement = document.createElement('div');
    packElement.classList.add('pack-element');

    const packTitle = document.createElement('p');
    packTitle.textContent = this.title;
    packElement.appendChild(packTitle);

    packElement.addEventListener('click', () => editPack(pack.id))

    return packElement;
  }
}

class Card {
  constructor(cardObj){
    this.id = cardObj.id;
    this.front = cardObj.front;
    this.back = cardObj.back;
  }

  createElement(){
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-element');
    
    const front = document.createElement('textarea');
    front.value = this.front;
    front.addEventListener('change', () => {
      USER.settings.flashcards.packs[getPackIndex(this.pack)][getCardIndex(this.pack, this.id)].front = front.value;
      updateUserData()
    })

    const back = document.createElement('textarea');
    back.value = this.back;
    back.addEventListener('change', () => {
      USER.settings.flashcards.packs[getPackIndex(this.pack)][getCardIndex(this.pack, this.id)].front = back.value;
      updateUserData()
    })

    cardElement.appendChild(front)
    cardElement.appendChild(back)
    return cardElement;
  }
}

function editPack(pack.id){

}

function getCardIndex(packTitle, cardId){
  return USER.settings.flashcards.packs[getPackIndex(packTitle)].findIndex(card => card.id === cardId);
}

function getPackIndex(packTitle){
  return USER.settings.flashcards.packs.findIndex(pack => pack.title === packTitle);
}
