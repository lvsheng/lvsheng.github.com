/**
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    namespace.Hammer = cc.Sprite.extend({
        ctor: function () {
            var self = this;
            self._super();

            //初始化字段
            self._hittingEffect = null;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            //纹理会被后面add的hammer的child覆盖掉，这里是为了设置self的宽高
            self.setTexture(namespace.resourceFileMap.hammer_png);

            self._hittingEffect = new cc.Sprite(namespace.resourceFileMap.hitEffect_png);
            self._hittingEffect.attr({
                x: 10,
                y: 80,
                rotation: -130,
                visible: false
            });
            self.addChild(self._hittingEffect);

            //这里是真正显示的锤子，为了把hittingEffect挡住，放在其后又添加了这个child
            var coverHammerChild = new cc.Sprite(namespace.resourceFileMap.hammer_png);
            coverHammerChild.attr({
                anchorX: 0,
                anchorY: 0,
                x: 0,
                y: 0
            });
            self.addChild(coverHammerChild);

            self.setVisible(false);

            //TODO: for debug:
            window.hammer = self;
            window.hitting = self._hittingEffect;
        },
        hit: function (hammerHeadX, hammerHeadY, hittedMouse) {
            var self = this;

            var anchorX = .7;
            var anchorY = .3;
            self.attr({
                anchorX: anchorX,
                anchorY: anchorY,
                rotation: 0,
                visible: true,
                x: hammerHeadX + (self.width * anchorX) - 35,
                y: hammerHeadY + (self.height * anchorY)
            });

            self.stopAllActions();

            var rotationBackAction = new cc.RotateTo(.08, 50);
            var rotationDownAction = new cc.RotateTo(.03, -60);
            var delayAction = new cc.DelayTime(.02);
            var hideAction = new cc.Hide();
            if (hittedMouse) {
                self.runAction(new cc.Sequence(
                    rotationBackAction,
                    rotationDownAction,
                    new cc.CallFunc(function () {
                        self._hittingEffect.setVisible(true);
                        self._hittingEffect.setOpacity(255);
                        self._hittingEffect.runAction(new cc.Sequence(
                            new cc.ScaleTo(0.02, 1.5),
                            new cc.FadeOut(0.02),
                            new cc.CallFunc(function () {
                                self.runAction(hideAction);
                                hittedMouse.afterHitPoppedMouse();
                            })
                        ))
                    })
                ));
            } else {
                self.runAction(new cc.Sequence(
                    rotationBackAction,
                    rotationDownAction,
                    delayAction,
                    hideAction
                ));
            }
        }
    });
})(window.myGame);
