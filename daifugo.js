function Card(rank, suit, value) {
    this.rank = rank.toString();
    this.suit = suit || '';
    this.value = value;
}

Card.prototype.toString = function() {
    return this.rank + ' of ' + this.suit;
};

function Deck(type, jokerCount) {
    var ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
        suits = ['Diamonds','Hearts','Spades','Clubs'];

    this.cards = generateDeck(type, jokerCount);

    /*
        standard = 52 card deck + jokers
    */
    function generateDeck(type, jokerCount) {
        var cards = [];

        if (type === 'standard') {
            for (var i = 0; i < ranks.length; i++) {
                for (var j = 0; j < suits.length; j++) {
                    cards.push(new Card(ranks[i], suits[j]));
                }
            }

            for (var i = 0; i < jokerCount; i++) {
                cards.push(new Card('Joker'));
            }
        }

        return cards;
    }
}

Deck.prototype.shuffle = function() {
    var cardCount = this.cards.length,
        j, tmpCard;

    for (var i = 0; i < cardCount; i++) {
        j = Math.floor(Math.random() * cardCount);
        tmpCard = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = tmpCard;
    }
};

Deck.prototype.friendlyDeck = function() {
    var cards = [];

    for (var i = 0; i < this.cards.length; i++) {
        cards[i] = this.cards[i].toString();
    }

    return cards;
}

Deck.prototype.findCard(rank, suit) {

};

Deck.

function Hand(cards) {
    this.cards = cards;
}

Hand.prototype = new Deck();

function Player(cards) {
    this.hand = new Hand(cards);
}


function Daifugo() {
    
}

function DaifugoAI() {
    
}

var deck = new Deck('standard', 2);
deck.shuffle();
var friendly = deck.friendlyDeck();