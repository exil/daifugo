// an extremely basic and limited pub/sub
(function(window) {
    var topics = [];

    window.notify = function(topic) {
        var args = [].slice.call(arguments);

        args.shift();

        if (typeof topics[topic] !== "undefined") {
            topics[topic].apply(this, args);
        }
    };

    window.listen = function(topic, callback) {
        topics[topic] = callback;
    };
})(this);