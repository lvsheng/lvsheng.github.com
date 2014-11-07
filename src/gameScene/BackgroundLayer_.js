/**
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    namespace.BackgroundLayer = cc.Layer.extend({
        ctor: function () {
            this._super();

            this.init();
        },
        init: function () {
            var self = this;
            self._super();

            var windowSize = cc.director.getWinSize();

            var centerPosition = cc.p(windowSize.width / 2, windowSize.height / 2);
            var backgroundSprite = new cc.Sprite(namespace.resourceFileMap.background_png);
            backgroundSprite.setPosition(centerPosition.x, centerPosition.y);
            self.addChild(backgroundSprite);
        }
    });
})(window.myGame);
