(function (namespace) {
    namespace.scoreManager = {
        _score: 0,
        getScore: function () {
            return this._score;
        },
        hitOneSuccessful: function () {
            ++this._score;
        }
    };
})(window.myGame);
