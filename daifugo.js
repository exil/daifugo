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

    for (var i = cardCount - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i);
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
    for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i].rank === rank && this.cards[i].suit === suit) {
            return i;
        }
    }

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
        return this.cards.splice(index, 1)[0];
    }

    return false;
};


function Daifugo(numberOfPlayers, rules) {
    this.players = [];

    for (var i = 0; i < numberOfPlayers; i++) {
        this.players.push(new DaifugoPlayer());
    }
}

Daifugo.prototype.deal = function(start) {
    var deck = new CardSet(),
        playerCount = this.players.length,
        index = start,
        deckSize = 0,
        card;

    deck.generateDeck('standard', 2).shuffle();
    deckSize = deck.cards.length;

    // give card to each player
    for (var i = 0; i < deckSize; i++) {
        card = deck.removeCard();
        if (card) {
            this.players[index].dealCard(card);
            index++;

            if (index === playerCount) {
                index = 0;
            }
        } else {
            throw "Something is very wrong with the deck..."
        }
    }
};

function DaifugoPlayer(cards) {
    this.hand = new CardSet(cards);
    this.title = '';
}

DaifugoPlayer.prototype.dealCard = function(card) {
    this.hand.cards.push(card);
};

function DaifugoAI() {
    
}

DaifugoAI.prototype = new DaifugoPlayer;

var game = new Daifugo(3);
game.deal(0);
/*
var cards = new CardSet();
cards.generateDeck('standard', 2).shuffle();
var friendly = cards.friendlyCardSet();
*/