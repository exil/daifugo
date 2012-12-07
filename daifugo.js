function Card(rank, suit, value) {
    this.rank = rank.toString();
    this.suit = suit || '';
    this.value = value;
}

Card.prototype.toString = function() {
    return this.rank + ' of ' + this.suit;
};

function CardSet(cards) {
    this.cards = cards || [];
}

CardSet.prototype.generateDeck = function(type, jokerCount) {
    var ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
        suits = ['Diamonds','Hearts','Spades','Clubs'];

    if (type === 'standard') {
        for (var i = 0; i < ranks.length; i++) {
            for (var j = 0; j < suits.length; j++) {
                this.cards.push(new Card(ranks[i], suits[j]));
            }
        }

        for (var k = 0; k < jokerCount; k++) {
            this.cards.push(new Card('Joker'));
        }
    }

    return this;
};

CardSet.prototype.shuffle = function() {
    var cardCount = this.cards.length,
        j, tmpCard;

    for (var i = 0; i < cardCount; i++) {
        j = Math.floor(Math.random() * cardCount);
        tmpCard = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = tmpCard;
    }

    return this;
};

CardSet.prototype.friendlyCardSet = function() {
    var cards = [];

    for (var i = 0; i < this.cards.length; i++) {
        cards[i] = this.cards[i].toString();
    }

    return cards;
};

/*
    returns index of card
*/
CardSet.prototype.findCard = function(rank, suit) {
    return -1;
};

/*
    returns the card that was removed
*/
CardSet.prototype.removeCard = function(rank, suit) {
    var index, card;

    if (typeof rank === "undefined") {
        return this.cards.pop();
    }

    index = this.findCard(rank, suit);

    if (index > -1) {
        return this.cards.splice(index, 1);
    }

    return false;
};


function Player(cards) {
    this.hand = new CardSet(cards);
}


function Daifugo() {
    
}

function DaifugoAI() {
    
}

var cards = new CardSet();
cards.generateDeck('standard', 2).shuffle();
var friendly = cards.friendlyCardSet();