/**
 * @dependence namespace.scoreManager
 * @dependence namespace.showResult
 */
(function (namespace) {
    namespace.endGame = function () {
        var score = namespace.scoreManager.getScore();
        cc.director.end();
        namespace.showResult(score);
    };
})(window.myGame);
