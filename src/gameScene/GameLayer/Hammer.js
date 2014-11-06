/**
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    namespace.Hammer = cc.Sprite.extend({
        ctor: function () {
            var self = this;
            self._super();

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            self.setTexture(namespace.resourceFileMap.hammer_png);

            self.setVisible(false);

            //TODO: for debug
            window.hammer = self;
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

            var rotationBackAction = new cc.RotateTo(.08, 50);
            var rotationDownAction = new cc.RotateTo(.03, -60);
            var delayAction = new cc.DelayTime(.02);
            var hideAction = new cc.Hide();
            self.runAction(new cc.Sequence(
                rotationBackAction,
                rotationDownAction,
                delayAction,
                hideAction
            ));
        }
    });
})(window.myGame);
