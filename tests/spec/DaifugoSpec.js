describe('Card', function() {
    it('should create a new card', function() {
        var card = new Card('9', 'Hearts');

        expect(card.rank).toBe('9');
        expect(card.suit).toBe('Hearts');
    });
});

describe('CardSet', function() {
    var cardSet1,
        cardSet2;

    beforeEach(function() {
        cardSet1 = new CardSet();
        cardSet2 = new CardSet();
    });

    it('should create an empty deck of cards if nothing is passed to constructor', function() {
        expect(cardSet1.cards).toEqual([]);
    });

    it('should generate a standard deck of cards', function() {
        var standardDeck = [];
    });
});