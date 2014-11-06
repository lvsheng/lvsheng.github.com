/**
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    namespace.Hammer = cc.Sprite.extend({
        ctor: function () {
            var self = this;
            self._super();

            //初始化字段
            self._hitAction = null;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            self.setTexture(namespace.resourceFileMap.hammer_png);

            self.setVisible(false);

            var rotationBackAction = new cc.RotateTo(.08, 50);
            var rotationDownAction = new cc.RotateTo(.03, -60);
            var delayAction = new cc.DelayTime(.02);
            var hideAction = new cc.Hide();
            self._hitAction = new cc.Sequence(
                rotationBackAction,
                rotationDownAction,
                delayAction,
                hideAction
            );
        },
        hit: function (hammerHeadX, hammerHeadY) {
            var self = this;

            self.attr({
                anchorX: .7,
                anchorY: .3,
                rotation: 0,
                visible: true
            });

            var x = hammerHeadX + (self.width * self.anchorX) - 35;
            var y = hammerHeadY + (self.height * self.anchorY);

            self.attr({
                x: x,
                y: y
            });

            self.stopAllActions();
            self.runAction(self._hitAction);
        }
    });
})(window.myGame);
