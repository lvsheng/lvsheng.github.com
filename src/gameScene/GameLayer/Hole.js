/**
 * @dependence namespace.scoreManager
 * @dependence namespace.resourceFileMap
 * @dependence namespace.zIndexConf
 */
(function (namespace) {
    var HoleExtended = {
        _STATUS: {
            idle: 'idle',
            mouseOn: 'mouseOn',
            animating: 'animating'
        },

        ctor: function () {
            var self = this;
            self._super();

            //字段声明
            self._status = self._STATUS.idle;
            self._popOnMouse = null;

            self._uncle = null;
            self._lover = null;
            self._leftHeart = null;
            self._rightHeart = null;
            self._fog = null;
            self._plusOne = null;
            self._uncleSay = null;
            self._loverSay = null;
            self._mouseMask = null;

            self.init();
        },
        init: function () {
            var self = this;
            var resourceFileMap = namespace.resourceFileMap;
            var zIndexConf = namespace.zIndexConf;
            self._super();

            self.setTexture(resourceFileMap.hole_png);
            var anchorX = self.width / 2;
            var anchorY = self.height / 2;

            var uncle = new cc.Sprite(resourceFileMap.uncle_png);
            uncle.attr({
                x: anchorX,
                y: anchorY - (uncle.height / 2) - 5,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(uncle);
            self._uncle = uncle;

            var lover = new cc.Sprite(resourceFileMap.lover_png);
            lover.attr({
                x: anchorX,
                y: anchorY - (lover.height / 2) - 5,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(lover);
            self._lover = lover;

            var leftHeart = new cc.Sprite(resourceFileMap.heartLeft_png);
            var heartY = anchorY + leftHeart.height / 2 + 50;
            leftHeart.attr({
                x: anchorX - leftHeart.width / 2 - 2,
                y: heartY,
                zIndex: zIndexConf.effectProp,
                visible: false
            });
            self.addChild(leftHeart);
            self._leftHeart = leftHeart;

            var rightHeart = new cc.Sprite(resourceFileMap.heartRight_png);
            rightHeart.attr({
                x: anchorX + rightHeart.width / 2 + 2,
                y: heartY,
                zIndex: zIndexConf.effectProp,
                visible: false
            });
            self.addChild(rightHeart);
            self._rightHeart = rightHeart;

            var plusOne = new cc.Sprite(resourceFileMap.plus_png);
            var plusOneY = anchorY + plusOne.height / 2 + 70;
            plusOne.attr({
                x: anchorX,
                y: plusOneY,
                zIndex: zIndexConf.effectProp,
                visible: false
            });
            self.addChild(plusOne);
            self._plusOne = plusOne;

            var fog = new cc.Sprite(resourceFileMap.fog_png);
            fog.attr({
                x: anchorX,
                y: anchorY + 13,
                zIndex: zIndexConf.effectProp,
                visible: false
            });
            self.addChild(fog);
            self._fog = fog;

            var uncleSay = new cc.Sprite(resourceFileMap.uncleSay_png);
            var uncleSayAnchorX = 0.64;
            uncleSay.attr({
                anchorX: uncleSayAnchorX,
                anchorY: 1,
                x: anchorX + (uncleSayAnchorX - 0.5) * uncleSay.width,
                y: anchorY - 10,
                zIndex: zIndexConf.effectProp,
                visible: false
            });
            self.addChild(uncleSay);
            self._uncleSay = uncleSay;

            var loverSay = new cc.Sprite(resourceFileMap.loverSay_png);
            var loverSayAnchorX = 0.44;
            loverSay.attr({
                anchorX: loverSayAnchorX,
                anchorY: 1,
                x: anchorX + (loverSayAnchorX - 0.5) * loverSay.width,
                y: anchorY - 10,
                zIndex: zIndexConf.effectProp,
                visible: false
            });
            self.addChild(loverSay);
            self._loverSay = loverSay;

            var mouseMask = new cc.Sprite(resourceFileMap.mask_png);
            mouseMask.attr({
                anchorX: 0.5,
                anchorY: 1,
                x: anchorX,
                y: anchorY + 35,
                zIndex: zIndexConf.holeMask
            });
            self.addChild(mouseMask);
            self._mouseMask = mouseMask;
        },

        canPopMouse: function () {
            return this._status === this._STATUS.idle;
        },
        hasMouseOn: function () {
            return this._status === this._STATUS.mouseOn;
        },
        judgeHittingPopOnMouse: function (x, y) {
            var self = this;
            var HITTING_AREA_HEIGHT = 124;
            var HITTING_AREA_WIDTH = 137;
            var positionReferAnchor = self.convertToNodeSpaceAR(cc.p(x, y));

            if (self.hasMouseOn()) {
                return (
                    (positionReferAnchor.y > 0 && positionReferAnchor.y <= HITTING_AREA_HEIGHT)
                        && (Math.abs(positionReferAnchor.x) < HITTING_AREA_WIDTH / 2)
                    );
            } else {
                return false;
            }
        },

        popMouse: function () {
            var self = this;

            //TODO: 播放动画
            self._status = self._STATUS.mouseOn;
        },
        hitPopOnMouse: function () {
            var self = this;

            //TODO: 应该先放动画，再放完了加分，动画中改状态，动画完后再改状态
            namespace.scoreManager.hitOneSuccessful();
            self._status = self._STATUS.idle;
        }
    };
    namespace.Hole = cc.Sprite.extend(HoleExtended);
})(window.myGame);
