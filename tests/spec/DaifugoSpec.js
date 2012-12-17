describe('Card', function() {
    it('should create a new card', function() {
        var card = new Card('9', 'Hearts');

        expect(card.rank).toBe('9');
        expect(card.suit).toBe('Hearts');
    });

    it('should convert standard card to a string', function() {
        var card = new Card('5', 'Diamonds');

        expect(card.toString()).toBe('5 of Diamonds');
    });
});

describe('CardSet', function() {
    var cardSet1,
        cardSet2,
        ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
        suits = ['Diamonds','Hearts','Spades','Clubs'],
        allCardNames = [];

    beforeEach(function() {
        cardSet1 = new CardSet();
        cardSet2 = new CardSet();
        allCardNames = [];

        // create an array of the all the cards in friendly name format
        for (var i = 0; i < ranks.length; i++) {
            for (var j = 0; j < suits.length; j++) {
                allCardNames.push((new Card(ranks[i], suits[j])).toString());
            }
        }
    });

    it('should create an empty deck of cards if nothing is passed to constructor', function() {
        expect(cardSet1.cards).toEqual([]);
    });

    it('should generate a standard deck of cards', function() {
        var standardDeck = [],
            cardNotFound = false;

        standardDeck = cardSet1.generateDeck('standard', 0).cards;

        for (var i = 0; i < standardDeck.length; i++) {
            var card = standardDeck[i].toString();

            if (allCardNames.indexOf(card) === -1) {
                cardNotFound = true;
            }
        }

        expect(standardDeck.length).toBe(52);
        expect(cardNotFound).toBeFalsy();
    });

    it('should find a card in a deck', function() {
        cardSet1.generateDeck('standard', 0);
        cardSet1.cards[27].rank = '7';
        cardSet1.cards[27].suit = 'Tests';

        var index = cardSet1.findCard('7', 'Tests');

        expect(index).toBe(27);
    });

    it('should remove the top card from a deck if no parameters are specified', function() {
        cardSet1.generateDeck('standard', 0);

        var rank = cardSet1.cards[cardSet1.cards.length - 1].rank,
            suit = cardSet1.cards[cardSet1.cards.length - 1].suit,
            card = cardSet1.removeCard();

        expect(card.rank).toBe(rank);
        expect(card.suit).toBe(suit);
    });

    it('should remove a specified card from a deck', function() {
        cardSet1.generateDeck('standard', 0);
        cardSet1.cards[27].rank = '7';
        cardSet1.cards[27].suit = 'Tests';

        var card = cardSet1.removeCard('7', 'Tests');

        expect(card.rank).toBe('7');
        expect(card.suit).toBe('Tests');
    });

    // shuffles deck of cards 
    it('should shuffle a deck of cards', function() {
        var frequency = 0,
            results = [],
            shuffleTimes = 1000,
            cardSet1Index = -1,
            cardSet2Index = -1;

        cardSet1.generateDeck('standard', 0); // tester card set

        cardSet2.cards = cardSet1.cards.slice(0); // original card set
        var b = cardSet1.cards[0];

        for (var i = 0; i < shuffleTimes; i++) {
            cardSet1.shuffle();
            frequency = 0;

            for (var j = 0; j < cardSet2.cards.length; j++) {
                cardSet1Index = cardSet1.findCard(cardSet2.cards[j].rank, cardSet2.cards[j].suit);
                if (cardSet1Index === -1) {
                    throw "something went terribly wrong."
                } else if (cardSet1Index === j) { // cards are in the same position
                    frequency++;
                }
            }

            results.push(frequency);
        }


        // get average frequency after shuffling shuffleTimes
        var sum = 0,
            average = 0;

        for (var i = 0; i < results.length; i++) {
            sum += results[i];
        }

        average = sum / results.length;

        expect(average).toBeGreaterThan(0);
        expect(average).toBeLessThan(5);
    });
});

describe('Daifugo Game', function() {
    var game;

    describe('initialization', function() {
        it('should create 3 players when new object is created', function() {
            game = new Daifugo(3);

            expect(game.players.length).toBe(3);
        });

        it('should create a new deck with 2 jokers', function() {
            game = new Daifugo(1);

            expect(game.deck.cards.length).toBe(54);
        });
    });

    describe('dealing deck', function() {
        it('should not deal any cards if player index is greater than the number of players', function() {

        });

        it('should deal all cards to one player', function() {
            game = new Daifugo(1);
            game.deal(0);

            expect(game.deck.cards.length).toBe(0);
            expect(game.players[0].hand.cards.length).toBe(54);
        });

        it('should deal same number of cards to two players', function() {
            game = new Daifugo(2);
            game.deal(0);

            expect(game.deck.cards.length).toBe(0);
            expect(game.players[0].hand.cards.length).toBe(27);
            expect(game.players[1].hand.cards.length).toBe(27);
        });

        it('should deal same number of cards to three players', function() {
            game = new Daifugo(3);
            game.deal(0);

            expect(game.deck.cards.length).toBe(0);
            expect(game.players[0].hand.cards.length).toBe(18);
            expect(game.players[1].hand.cards.length).toBe(18);
            expect(game.players[2].hand.cards.length).toBe(18);
        });

        it('should deal even as possible number of cards to four players', function() {
            game = new Daifugo(4);
            game.deal(0);

            expect(game.deck.cards.length).toBe(0);
            expect(game.players[0].hand.cards.length).toBe(14);
            expect(game.players[1].hand.cards.length).toBe(14);
            expect(game.players[2].hand.cards.length).toBe(13);
            expect(game.players[3].hand.cards.length).toBe(13);
        });
    });

    describe('dealing individual card', function() {
        it('should not deal a card if deck is empty', function() {

        });

        it('should deal a card if player\'s hand is empty', function() {

        });
    });

    describe('making a move with no active cards', function() {
        beforeEach(function() {
            game = new Daifugo(3);
            game.activeSet.cards = [];
            game.activeType = '';

            spyOn(CardSet.prototype, 'removeCards');
        })

        it('should recognize 1group as valid', function (){
            var cards = [new Card('5', 'Diamonds')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('1group');
        });

        it('should recognize 2group as valid', function (){
            var cards = [new Card('3', 'Diamonds'), new Card('3', 'Hearts')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('2group');
        });

        it('should recognize 3group as valid', function (){
            var cards = [new Card('K', 'Diamonds'), new Card('K', 'Hearts'), new Card('K', 'Clubs')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('3group');
        });

        it('should recognize 4group as valid', function (){
            var cards = [new Card('10', 'Diamonds'), new Card('10', 'Hearts'), 
                new Card('10', 'Clubs'), new Card('10', 'Spades')];

            expect(game.makePlay(cards)).toBeTruthy();            
            expect(game.activeType).toBe('4group');
        });

        it('should recognize a 4run as valid', function (){
            var cards = [new Card('Q', 'Diamonds'), new Card('K', 'Diamonds'), 
                new Card('A', 'Diamonds'), new Card('2', 'Diamonds')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('4run');
        });

        it('should recognize a 1group joker as a valid card', function (){
            var cards = [new Card('Joker', 'Jokers')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('1group');
        });

        it('should recognize a 2group w/ joker as valid', function (){
            var cards = [new Card('Joker', 'Jokers'), new Card('5', 'Diamonds')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('2group');
        });

        it('should recognize 3group w/ joker as valid', function (){
            var cards = [new Card('Joker', 'Jokers'), new Card('7', 'Diamonds'), new Card('7', 'Hearts')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('3group');
        });

        it('should recognize 4group w/ two jokers as valid', function (){
            var cards = [new Card('Joker', 'Jokers'), new Card('Joker', 'Jokers'), 
                new Card('2', 'Spades'), new Card('2', 'Clubs')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('4group');
        });

        it('should recognize a 5run with two jokers as valid', function (){
            var cards = [new Card('3', 'Hearts'), new Card('5', 'Hearts'), new Card('Joker', 'Jokers'),
                new Card('7', 'Hearts'), new Card('Joker', 'Jokers')];

            expect(game.makePlay(cards)).toBeTruthy();
            expect(game.activeType).toBe('5run');
        });

        it('should recognize a run with different suits as invalid', function() {
            var cards = [new Card('3', 'Hearts'), new Card('4', 'Hearts'), new Card('5', 'Diamonds')];

            expect(game.makePlay(cards)).toBeFalsy();
        });

        it('should recognize two cards of different ranks as invalid', function() {
            var cards = [new Card('3', 'Hearts'), new Card('9', 'Hearts')];

            expect(game.makePlay(cards)).toBeFalsy();
        });

        it('should recognize four cards of three same ranks as invalid', function() {
            var cards = [new Card('3', 'Hearts'), new Card('3', 'Diamonds'), 
                new Card('3', 'Spades'), new Card('2', 'Clubs')];

            expect(game.makePlay(cards)).toBeFalsy();
        });

        it('should recognize a sequence of two cards as invalid', function() {
            var cards = [new Card('3', 'Hearts'), new Card('4', 'Hearts')];

            expect(game.makePlay(cards)).toBeFalsy();
        });
    });

    describe('making a move with active cards', function() {
        it('should recognize 2group "4,4" trumps active 2group "3,3"', function() {
            game.activeSet.cards = [new Card('3', 'Diamonds'), new Card('3', 'Hearts')];
            game.activeType = '2group';
            game.activeHighCard = new Card('3', 'Diamonds');

            var cards = [new Card('4', 'Clubs'), new Card('4', 'Hearts')];

            expect(game.makePlay(cards)).toBeTruthy();
        });

        it('should recognize 2group "Joker,Joker" trumps 2group "2,2"', function() {
            game.activeSet.cards = [new Card('2', 'Clubs'), new Card('2', 'Hearts')];
            game.activeType = '2group';
            game.activeHighCard = new Card('2', 'Clubs');

            var cards = [new Card('Joker', 'Jokers'), new Card('Joker', 'Jokers')];

            expect(game.makePlay(cards)).toBeTruthy();
        });

        it('should recognize 2group with same rank as active 2group as invalid', function() {
            game.activeSet.cards = [new Card('2', 'Clubs'), new Card('2', 'Hearts')];
            game.activeType = '2group';
            game.activeHighCard = new Card('2', 'Clubs');

            var cards = [new Card('2', 'Diamonds'), new Card('2', 'Spades')];

            expect(game.makePlay(cards)).toBeFalsy();
        });

        it('should recognize trumping 4run with active 4run as valid', function() {
            game.activeSet.cards = [new Card('3', 'Clubs'), new Card('4', 'Clubs'),
                new Card('5', 'Clubs'), new Card('6', 'Clubs')];
            game.activeType = '4run';
            game.activeHighCard = new Card('6', 'Clubs');

            var cards = [new Card('4', 'Diamonds'), new Card('5', 'Diamonds'),
                new Card('6', 'Diamonds'), new Card('7', 'Diamonds')];

            expect(game.makePlay(cards)).toBeTruthy();
        });

        //it('should recognize 4run with active 4run w/ joker as '))

        it('should recognize 3group Joker,Joker,K trumps 3group Q,Q,Q', function() {

        });

        it('should recognize 3run Joker,Joker,K trumps 3run Q,K,A', function() {

        });

        it('should recognize 3run Joker,Joker,K does not trump 3run K,A,2', function() {

        });

        it('should recognize 3,4,5,Joker does not trump active 4run Q, K, A, 2', function() {
            game.activeSet.cards = [new Card('Q', 'Clubs'), new Card('K', 'Clubs'),
                new Card('A', 'Clubs'), new Card('2', 'Clubs')];
            game.activeType = '4run';
            game.activeHighCard = new Card('2', 'Clubs');

            var cards = [new Card('3', 'Diamonds'), new Card('4', 'Diamonds'),
                new Card('5', 'Diamonds'), new Card('Joker', 'Jokers')];

            expect(game.makePlay(cards)).toBeFalsy();           
        });

        it('should recognize 5,Joker does not trump active 2,2', function() {
            game.activeSet.cards = [new Card('2', 'Clubs'), new Card('2', 'Hearts')];
            game.activeType = '2group';
            game.activeHighCard = new Card('2', 'Clubs');

            var cards = [new Card('5', 'Diamonds'), new Card('Joker', 'Jokers')];

            expect(game.makePlay(cards)).toBeFalsy();           
        });
    });

});