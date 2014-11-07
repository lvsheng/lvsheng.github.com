/**
 * @dependence namespace.restartGame
 */
(function (namespace) {
    namespace.showResult = function (score) {
        if (confirm('Game Over~\n你共打死了' + score + ' 个地鼠！\n要再来一局吗？')) {
            namespace.restartGame();
        }
    };
})(window.myGame);
