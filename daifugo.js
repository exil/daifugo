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
            this.cards.push(new Card('Joker', 'Joker'));
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

CardSet.prototype.sort = function(rankOrder, suitOrder) {
    // sort by suit
    this.cards.sort(function(a, b) {
        return ( (suitOrder.indexOf(a.suit) + 1) * 100 + (rankOrder.indexOf(a.rank) + 1) ) - 
            ( (suitOrder.indexOf(b.suit) + 1) * 100 + (rankOrder.indexOf(b.rank) + 1) );
    });

}

// rules could include jokers, 8, 10, etc.
function Daifugo(numberOfPlayers, rules) {
    this.players = [];

    for (var i = 0; i < numberOfPlayers; i++) {
        this.players.push(new DaifugoPlayer(this, i));
    }

    this.currentPlayer = '';

    this.deck = new CardSet();
    this.deck.generateDeck('standard', 2).shuffle();

    // center cards
    this.activeSet = new CardSet();
    this.activeType = ''; // one, two, three, four, 3run, 4run, 5run, etc.
}

Daifugo.prototype.start = function() {    
    this.deal(deck, 0);

    this.currentPlayer = this.players[0].setTurn();
};

Daifugo.prototype.deal = function(startingPlayer) {
    var playerCount = this.players.length,
        index = startingPlayer,
        deckSize = this.deck.cards.length,
        card;

    // give card to each player
    for (var i = 0; i < deckSize; i++) {
        card = this.deck.removeCard();
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

/*
    this function checks if the cards
    are a valid play
*/
Daifugo.prototype.isValidPlay = function(cards) {
    var rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'Joker'],
        suitOrder = ['Diamonds', 'Hearts', 'Spades', 'Clubs', 'Jokers'],
        playCards = new CardSet(cards);

    function prev(rank) {
        return rankOrder[rankOrder.indexOf(rank) - 1];
    }

    function groupType() {
        var testCards = new CardSet(cards.slice(0));

        // remove all jokers
        var index = testCards.findCard('Joker', 'Jokers');
        while (index > -1) {
            testCards.cards.splice(index, 1);
            index = testCards.findCard('Joker', 'Jokers');
        }

        for (var i = 1; i < testCards.cards.length; i++) {
            if (testCards.cards[i].rank !== testCards.cards[i - 1].rank) {
                return '';
            }
        }

        return cards.length + 'group';
    }

    function runType() {
        if (cards.length < 3) {
            return '';
        }

        var testCards = new CardSet(cards.slice(0));
        testCards.sort(rankOrder, suitOrder);

        var index = testCards.findCard('Joker', 'Jokers'),
            jokerCount = 0;

        while (index > -1) {
            testCards.cards.splice(index, 1);
            jokerCount++;
            index = testCards.findCard('Joker', 'Jokers');
        }

        var gapCount = 0;

        for (var i = 1; i < testCards.cards.length; i++) {
            if (testCards.cards[i].suit !== testCards.cards[i - 1].suit) {
                return '';
            } else {
                // calculate difference between ranks
                // to determine # of jokers needed to fill
                // gaps
                gapCount += rankOrder.indexOf(testCards.cards[i].rank) - rankOrder.indexOf(testCards.cards[i - 1].rank) - 1;
            }
        }

        // check if there are a sufficient number of jokers
        // to fill the gaps
        if (jokerCount >= gapCount) {
            return cards.length + 'run';
        }

        return '';
    }

    // remember, can be a run AND a group if jokers are used
    var test = runType() || groupType();
    console.log(test);
    /*var isValidPairing = true,
        isValidRun = true;

    // first determine if the cards are a valid set
    for (var i = 1; i < cards.length; i++) {
        if (isValidPairing && cards[i].rank === cards[i - 1].rank) { // valid pairing
            isValidRun = false;
            isValidPairing = true;
        } else if (isValidRun && prev(cards[i].rank) === cards[i - 1].rank) { // or a valid run
            isValidPairing = false;
            isValidRun = true;
        } else { // not valid at all
            isValidPairing = false;
            isValidRun = false;
        }
    }

    var isValid = isValidRun || isValidPairing;
    */

    if (this.activeSet.cards.length !== cards.length) {
        return false;
    }
}

function DaifugoPlayer(game, name, cards) {
    this.hand = new CardSet(cards);
    this.name = name;
    this.title = '';
    this.isTurn = false;
    this.game = game;
}

DaifugoPlayer.prototype.dealCard = function(card) {
    this.hand.cards.push(card);

    return this;
};

DaifugoPlayer.prototype.setTurn = function() {
    this.isTurn = true;

    return this;
}

DaifugoPlayer.prototype.play = function(cards) {
    var hasPassed = false;

    if (this.isTurn) {
        // verify these cards are in the users hand
        for (var i = 0; i < cards.length; i++) {
            if (this.hand.findCard(cards[i].rank, cards[i].suit) === -1) {
                return false;
            }
        }

        return this.game.isValidPlay(cards);
    }

    return false;
}

function DaifugoAI() {
    
}

DaifugoAI.prototype = new DaifugoPlayer;

var game = new Daifugo(3);
//game.deal(0);
/*
var cards = new CardSet();
cards.generateDeck('standard', 2).shuffle();
var friendly = cards.friendlyCardSet();
*/