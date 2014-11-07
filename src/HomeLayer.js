/**
 * @dependence namespace.resourceFileMap
 * @dependence namespace.GameScene
 */
(function (namespace) {
    namespace.HomeLayer = cc.Layer.extend({
        ctor: function () {
            this._super();

            this.init();
        },
        init: function () {
            var self = this;
            self._super();

            var windowSize = cc.director.getWinSize();

            var centerPosition = cc.p(windowSize.width / 2, windowSize.height / 2);
            var backgroundSprite = new cc.Sprite(namespace.resourceFileMap.home_png);
            backgroundSprite.setPosition(centerPosition.x, centerPosition.y);
            self.addChild(backgroundSprite);

            var menuItemPlay = new cc.MenuItemSprite(
                new cc.Sprite(namespace.resourceFileMap.start_png), // normal state image
                new cc.Sprite(namespace.resourceFileMap.startHover_png), //select state image
                new cc.Sprite(namespace.resourceFileMap.startHover_png), //select state image
                function () {
                    cc.director.runScene(new namespace.GameScene());
                },
                null
            );
            var menu = new cc.Menu(menuItemPlay);
            menu.setPosition({
                x: centerPosition.x,
                y: 175
            });
            self.addChild(menu);
        }
    });
})(window.myGame);
