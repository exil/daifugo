/*
    eventually we'll only want to expose the daifugo
    object
*/  

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
            this.cards.push(new Card('Joker', 'Jokers'));
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

CardSet.prototype.removeCards = function(cards) {
    for (var i = 0; i < cards.length; i++) {
        this.removeCard(cards[i].rank, cards[i].suit);
    }
}

CardSet.prototype.sort = function(sortType) {
    var rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'Joker'],
        suitOrder = ['Diamonds', 'Hearts', 'Spades', 'Clubs', 'Jokers'];

    suitMultiplier = sortType === 'suit' ? 100 : 1;
    rankMultiplier = sortType === 'rank' ? 100 : 1;

    this.cards.sort(function(a, b) {
        return ( (suitOrder.indexOf(a.suit) + 1) * suitMultiplier + (rankOrder.indexOf(a.rank) + 1) * rankMultiplier ) - 
            ( (suitOrder.indexOf(b.suit) + 1) * suitMultiplier + (rankOrder.indexOf(b.rank) + 1) * rankMultiplier );
    });

};

// rules could include jokers, 8, 10, etc.
function Daifugo(numberOfPlayers, rules) {
    this.players = [];

    for (var i = 0; i < numberOfPlayers; i++) {
        this.players.push(new DaifugoPlayer(this, i));
    }

    this.currentPlayer = this.players[0].setTurn();

    this.deck = new CardSet();
    this.deck.generateDeck('standard', 2).shuffle();

    // center cards
    this.activeSet = new CardSet();
    this.activeType = ''; // 1group, 2group, 3group, 4group, 3run, 4run, 5run, etc.

    this.playerRankings = [];
}

Daifugo.prototype.startGame = function() {   
    var game = this;

    this.deal(0);

    this.sortCards();

    notify('startGame', {
        currentPlayer: game.currentPlayer.name,
        hands: game.players.map(function(player) {
            return player.hand.cards;
        })
    })

    this.startRound(this.currentPlayer);
};

Daifugo.prototype.sortCards = function() {
    for (var i = 0; i < this.players.length; i++) {
        this.players[i].hand.sort('rank');
    }
};

Daifugo.prototype.startRound = function(player) {
    var game = this;

    this.activeSet = new CardSet();
    this.activeType = '';
    this.activeHighCard = {};

    for (var i = 0; i < this.players.length; i++) {
        this.players[i].lastMove = '';
    }
};

Daifugo.prototype.endRound = function(gameOver) {
    var game = this,
        nextPlayer = this.getNextPlayer();

    if (this.currentPlayer.hand.length === 0 || gameOver) {
        this.playerRankings.push(this.currentPlayer);

        if (!gameOver) {
            this.endGame();
        } else {
            this.currentPlayer.setTurn(false);
            this.currentPlayer = nextPlayer.setTurn(true);

            notify('updatePlayer', {
                currentPlayer: game.currentPlayer.name
            });

            this.startRound(nextPlayer);
        }
    } else {
        this.startRound(this.currentPlayer);
    }
};

Daifugo.prototype.endGame = function() {
    console.log(this.playerRankings);
};

// gets the next available player
Daifugo.prototype.getNextPlayer = function() {
    var playerOrder = this.players.slice(0);

    // put the current player at the start of the array
    [].unshift.apply(playerOrder, playerOrder.splice(this.currentPlayer.name));

    // look for the next player
    for (var i = 1; i < playerOrder.length; i++) {
        console.log(this.players[i]);
        if (this.players[i].hand.cards.length) {
            return this.players[i];
        }
    }

    // everyone else's hand is empty, meaning the game is over
    return false;
};

/*
    game > round > play
    a play is within a round
*/
Daifugo.prototype.nextPlay = function() {
    var game = this,
        nextPlayer = this.getNextPlayer();

    // end the round because no more players exist
    if (!nextPlayer) {
        this.endRound(true);

        return false;
    }

    this.currentPlayer.setTurn(false);
    this.currentPlayer = nextPlayer.setTurn(true);

    notify('updatePlayer', {
        currentPlayer: game.currentPlayer.name
    });

    // check if the previous players have all passed
    for (var i = 0; i < this.players.length; i++) {
        if (!this.currentPlayer.name !== i && this.players[i].lastMove === 'play') {
            return true;
        }
    }

    // end the round because all the previous players passed
    this.endRound(false);

    return false;
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

Daifugo.prototype.initPlay = function(cards, pass) {    
    // verify these cards are in the users hand
    for (var i = 0; i < cards.length; i++) {
        if (this.currentPlayer.hand.findCard(cards[i].rank, cards[i].suit) === -1) {
            console.log('trying to play a card that isn\'t in the hand');
            return false;
        }
    }

    if (this.makePlay(cards) || pass) {
        this.currentPlayer.lastMove = pass ? 'pass' : 'play';
        this.nextPlay();

        return true;
    }

    console.log('invalid play');
    return false;
};

/*
    this function checks if the cards
    are a valid play.
*/
Daifugo.prototype.makePlay = function(cards) {
    var rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'Joker'],
        suitOrder = ['Diamonds', 'Hearts', 'Spades', 'Clubs', 'Jokers'],
        playCards = new CardSet(cards),
        game = this;

    console.log('making play');

    // it is possible that a play can be a valid run and a valid group
    var runType = runType(),
        groupType = groupType(),
        type = runType || groupType,
        highCard;

    if (this.activeSet.cards.length !== 0 && (this.activeSet.cards.length !== cards.length)) {
        return false;
    }

    if (type) {
        if (this.activeSet.cards.length === 0 || (areSameType(runType, groupType) && trumps())) {
            this.activeHighCard = highCard;
            this.currentPlayer.hand.removeCards(cards);

            notify('updateCards', {
                hand: game.currentPlayer.hand.cards,
            });

            return this.setActive(cards, type);
        }
    }

    return false;

    // move these three functions somewhere eventually...
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

        // if only playing jokers, set to high card to be a joker
        highCard = testCards.cards[0] || cards[0];

        return cards.length + 'group';
    }

    function runType() {
        if (cards.length < 3) {
            return '';
        }

        var testCards = new CardSet(cards.slice(0));
        testCards.sort('suit');

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

        // difference to determine what the high card can be
        var highExtra = jokerCount - gapCount;
        // get the index of the highest ranked card excluding jokers, and "append" the extra jokers on the end
        highIndex = rankOrder.indexOf(testCards.cards[testCards.cards.length - 1].rank) + highExtra;
        highCard = highIndex > rankOrder.length - 1 ? new Card('Joker', 'Jokers') : new Card(rankOrder[highIndex], testCards.cards[0].suit);

        // check if there are a sufficient number of jokers
        // to fill the gaps
        if (jokerCount >= gapCount) {
            return cards.length + 'run';
        }

        return '';
    }

    function trumps() {
        console.log(highCard);
        return rankOrder.indexOf(highCard.rank) > rankOrder.indexOf(game.activeHighCard.rank);
    }

    function areSameType(runType, groupType) {
        return runType === game.activeType || groupType === game.activeType;
    }
};

Daifugo.prototype.setActive = function(cards, type) {
    var game = this;

    this.activeSet.cards = cards;
    this.activeType = type;

    notify('updateActiveSet', {
        activeSet: game.activeSet.cards
    })

    return true;
};

function DaifugoPlayer(game, name, cards) {
    this.hand = new CardSet(cards);
    this.name = name;
    this.title = '';
    this.isTurn = false;
    this.game = game;
    this.lastMove = ''; //play or pass
}

DaifugoPlayer.prototype.dealCard = function(card) {
    this.hand.cards.push(card);

    return this;
};

DaifugoPlayer.prototype.setTurn = function(isTurn) {
    var game = this.game;

    this.isTurn = isTurn;

    return this;
};



function DaifugoAI() {
    
}

DaifugoAI.prototype = new DaifugoPlayer;

//var game = new Daifugo(3);
//game.deal(0);
/*
var cards = new CardSet();
cards.generateDeck('standard', 2).shuffle();
var friendly = cards.friendlyCardSet();
*/