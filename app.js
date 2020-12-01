class AudioController {
  constructor() {
    this.bgMusic = new Audio('assets/audio/bg-music.wav');
    this.flipSound = new Audio('assets/audio/card-flip.wav');
    this.matchSound = new Audio('assets/audio/match.wav');
    this.winnerSound = new Audio('assets/audio/win-game.mp3');
    this.gameOverSound = new Audio('assets/audio/game-over.wav');
    this.hoverOverSound = new Audio('assets/audio/hover-over.ogg');
    this.bgMusic.volume = 0.15;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  hoverOver() {
    this.hoverOverSound.play();
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  winner() {
    this.stopMusic();
    this.winnerSound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class MixOrMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-ramaining');
    this.ticker = document.getElementById('flips');
    this.audioController = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);

    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }

  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('show');
      card.classList.remove('match');
    });
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('show');

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      // match
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMisMatch(card, this.cardToCheck);
    }
    this.cardToCheck = null;
  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('match');
    card2.classList.add('match');
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length) {
      this.winner();
    }
  }

  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('show');
      card2.classList.remove('show');
      this.busy = false;
    }, 1000)
  }

  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
  }

  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }

  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById('game-over-text').classList.add('visible');
  }

  winner() {
    clearInterval(this.countDown);
    this.audioController.winner();
    document.getElementById('game-winner-text').classList.add('visible');
  }

  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randomIndex].style.order = i;
      this.cardsArray[i].style.order = randomIndex;
    }
  }

  canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck
  }
}

function ready() {
  // create "overlay" and "card" arrays
  let overlays = Array.from(document.getElementsByClassName('overlay'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixOrMatch(60, cards);
  // add event listeners using foreach method

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
    })
  })

  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    })
  })
}

// check ready state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}

let audioController = new AudioController();