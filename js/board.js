(function() {
    var currentPlayer = -1;
    function startGame(data) {
        var html = '';

        currentPlayer = data.currentPlayer;

        for (var i = 0; i < data.hands.length; i++) {
            var hand = data.hands[i];

            html += '<div id="player-' + i + '" class="player ' + (currentPlayer === i ? 'active' : 'inactive') + '" data-player="' + i + '"><h3>Player ' + (i + 1) + '</h3>';
            html += '<a href="#" class="play action-btn">Play</a> <a href="#" class="pass action-btn">Pass</a>'
            html += '<ul class="cards">';
            html += drawHand(hand);
            html += '</ul></div>';
        }

        $('#players').css('width', data.hands.length * 161);

        $('#players').append(html);
    }

    function updatePlayer(data) {
        console.log(data.currentPlayer);
        currentPlayer = data.currentPlayer;

        $('.player').removeClass('active').addClass('inactive');

        $('#player-' + currentPlayer).addClass('active').removeClass('inactive');
    }

    function updateActiveSet(data) {
        var html = '<ul>';

        for (var i = 0; i < data.activeSet.length; i++) {
            var card = data.activeSet[i];

            html+= '<li class="card">' + card.toString() + '</li>';
        }      

        html += '</ul>';

        $('#common').html(html);     
    }

    function drawHand(hand) {
        var html = '';
        for (var j = 0; j < hand.length; j++) {
            var card = hand[j];

            html+= '<li class="card"><a class="card-select ' + card.suit.toLowerCase() + '" href="" data-rank="' + card.rank + '" data-suit="' + card.suit + '">' + card.toString() + '</a></li>';
        }

        return html;
    }

    $(document).ready(function() {
        // setup
        var game = new Daifugo(3);

        listen('startGame', startGame);

        $('#game').on('click', 'a.card-select', function() {
            if ($(this).parents('.player').hasClass('inactive')) {
                return false;
            }

            $(this).toggleClass('selected');

            return false;

        }).on('click', 'a.action-btn', function() {
            if ($(this).parents('.player').hasClass('inactive')) {
                return false;
            }
            // get selected cards
            var $selected = $(this).parents('.player').find('a.selected'), // get cards we can play
                cards = [],
                pass = $(this).hasClass('pass');

            if (!pass) {
                $selected.each(function() {
                    var card = new Card($(this).data('rank').toString(), $(this).data('suit'));
                        
                    cards.push(card);
                });
            }

            $selected.removeClass('selected');

            if (game.initPlay(cards, pass)) {
                if (!pass) {
                    $selected.remove();
                }
            }
            
            return false;
        });

        listen('updatePlayer', updatePlayer);

        listen('updateActiveSet', updateActiveSet);

        game.startGame();

    });
})();