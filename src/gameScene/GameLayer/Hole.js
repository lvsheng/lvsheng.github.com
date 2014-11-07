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

        _POP_LOVER_PROBABILITY: 0.2,

        ctor: function () {
            var self = this;
            self._super();

            //字段声明
            self._status = self._STATUS.idle;
            self._poppedMouse = null;

            self._uncle = null;
            self._lover = null;
            self._leftHeart = null;
            self._rightHeart = null;
            self._fog = null;
            self._plusOne = null;
            self._uncleSay = null;
            self._loverSay = null;
            self._mouseMask = null;

            self._mousePopOnAction = null;
            self._mousePullAction = null;

            self._uncleAutoPullTime = 3;
            self._loverAutoPullTime = 2;

            self._initialAttr = {
                hidingMouseY: null,
                fog: null,
                leftHeart: null,
                rightHeart: null,
                plusOne: null
            };
            self._hidingMouseY = null;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            self._initialView();
            self._initialAction();
        },

        canPopMouse: function () {
            return this._status === this._STATUS.idle;
        },
        hasMouseOn: function () {
            return this._status === this._STATUS.mouseOn;
        },
        judgeHittingPoppedMouse: function (x, y) {
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
            var poppedMouse = Math.random() <= self._POP_LOVER_PROBABILITY ? self._lover : self._uncle;

            self._poppedMouse = poppedMouse;
            self._status = self._STATUS.mouseOn;
            poppedMouse.runAction(self._mousePopOnAction);

            //防止冒出新鼠时与雾重叠
            self._fog.stopAllActions();
            self._fog.setVisible(false);

            var autoPullTime = (poppedMouse === self._lover ? self._loverAutoPullTime : self._uncleAutoPullTime);
            self.scheduleOnce(self._autoPullPoppedMouseProxy, autoPullTime);
        },
        preHitPoppedMouse: function () {
            var self = this;

            self._status = self._STATUS.animating; //animating之后不能再放鼠也不能再被打
            self.unschedule(self._autoPullPoppedMouseProxy);
        },
        //由hammer执行完挥锤子动画后调用
        afterHitPoppedMouse: function () {
            var self = this;
            if (self._poppedMouse === self._uncle) {
                self._poppedMouse.runAction(new cc.Sequence(
                    new cc.Spawn(
                        self._mousePullAction,
                        new cc.CallFunc(function () {
                            self._fog.attr(self._initialAttr.fog);
                            self._fog.setVisible(true);
                            self._fog.runAction(new cc.Sequence(
                                new cc.Spawn(
                                    new cc.ScaleTo(0.05, 1),
                                    new cc.FadeIn(0.05)
                                )
                            ));
                        })
                    ),
                    new cc.CallFunc(function () {
                        namespace.scoreManager.hitOneSuccessful();
                        self._fog.runAction(
                            new cc.FadeOut(0.2)
                        );
                        self._plusOne.attr(self._initialAttr.plusOne);
                        self._plusOne.setVisible(true);
                        self._plusOne.runAction(new cc.Spawn(
                            new cc.Sequence(
                                new cc.FadeIn(0.02),
                                new cc.FadeOut(0.8)
                            ),
                            new cc.MoveBy(0.82, 20, 60)
                        ));
                        self._status = self._STATUS.idle;
                    })
                ));
            } else {
                self._poppedMouse.runAction(new cc.Sequence(
                    self._mousePullAction,
                    new cc.CallFunc(function () {
                        self._status = self._STATUS.idle;
                    }),
                    new cc.CallFunc(function () {
                        var heartNames = ['leftHeart', 'rightHeart'];
                        var animateTime = .3;
                        var rotateTo;
                        for (var i = 0; i < heartNames.length; ++i) {
                            var currentHeartName = heartNames[i];
                            var currentHeart = self['_' + currentHeartName];
                            rotateTo = currentHeartName === 'leftHeart' ? -70 : 70;

                            var animateInTimeRate = 0.2;
                            var animateInTime = animateTime * animateInTimeRate;
                            var animateOutTime = animateTime * (1 - animateInTimeRate);
                            currentHeart.attr(self._initialAttr[currentHeartName]);
                            currentHeart.setVisible(true);
                            currentHeart.runAction(new cc.Sequence(
                                new cc.FadeIn(animateInTime),
                                new cc.Spawn(
                                    new cc.EaseIn(new cc.RotateTo(animateOutTime, rotateTo), 0.4),
                                    new cc.FadeOut(animateOutTime)
                                )
                            ));
                        }
                    })
                ));
            }
        },

        setUncleAutoPullTime: function (newTime) {
            this._uncleAutoPullTime = newTime;
        },

        setLoverAutoPullTime: function (newTime) {
            this._loverAutoPullTime = newTime;
        },

        _initialView: function () {
            var self = this;
            var resourceFileMap = namespace.resourceFileMap;
            var zIndexConf = namespace.zIndexConf;

            self.setTexture(resourceFileMap.hole_png);
            var anchorX = self.width / 2;
            var anchorY = self.height / 2;

            var uncle = new cc.Sprite(resourceFileMap.uncle_png);
            var hidingMouseY = anchorY - (uncle.height / 2) - 5;
            self._initialAttr.hidingMouseY = hidingMouseY;
            uncle.attr({
                x: anchorX,
                y: hidingMouseY,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(uncle);
            self._uncle = uncle;

            var lover = new cc.Sprite(resourceFileMap.lover_png);
            lover.attr({
                x: anchorX,
                y: hidingMouseY,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(lover);
            self._lover = lover;

            var leftHeart = new cc.Sprite(resourceFileMap.heartLeft_png);
            var heartY = anchorY + leftHeart.height / 2 + 30;
            self._initialAttr.leftHeart = {
                anchorX: 1,
                anchorY: 0,
                x: anchorX - 2,
                y: heartY,
                zIndex: zIndexConf.effectProp,
                visible: false,
                opacity: 255,
                rotation: 0
            };
            leftHeart.attr(self._initialAttr.leftHeart);
            self.addChild(leftHeart);
            self._leftHeart = leftHeart;

            var rightHeart = new cc.Sprite(resourceFileMap.heartRight_png);
            self._initialAttr.rightHeart = {
                anchorX: 0,
                anchorY: 0,
                x: anchorX + 2,
                y: heartY,
                zIndex: zIndexConf.effectProp,
                visible: false,
                opacity: 255,
                rotation: 0
            };
            rightHeart.attr(self._initialAttr.rightHeart);
            self.addChild(rightHeart);
            self._rightHeart = rightHeart;

            var plusOne = new cc.Sprite(resourceFileMap.plus_png);
            var plusOneY = anchorY + plusOne.height / 2 + 70;
            self._initialAttr.plusOne = {
                x: anchorX,
                y: plusOneY,
                zIndex: zIndexConf.effectProp,
                visible: false,
                opacity: 0
            };
            plusOne.attr(self._initialAttr.plusOne);
            self.addChild(plusOne);
            self._plusOne = plusOne;

            var fog = new cc.Sprite(resourceFileMap.fog_png);
            fog.attr({
                x: anchorX,
                y: anchorY + 13,
                zIndex: zIndexConf.effectProp,
                visible: false,
                scale: .7
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
                x: anchorX + 5,
                y: anchorY + 37,
                zIndex: zIndexConf.holeMask
            });
            self.addChild(mouseMask);
            self._mouseMask = mouseMask;
        },

        _initialAction: function () {
            var self = this;

            var holeAnchorY = self.height / 2;
            var mousePopOnMoveAction = new cc.MoveTo(0.1, self._uncle.x, holeAnchorY + self._uncle.height / 2);
            var mousePullMoveAction = new cc.MoveTo(0.06, self._uncle.x, self._initialAttr.hidingMouseY);

            self._mousePopOnAction = new cc.Sequence(
                new cc.EaseIn(mousePopOnMoveAction, .8),
                new cc.CallFunc(function () {
                    var animating = .5;
                    var initialRotation;
                    var saying;
                    if (self._poppedMouse === self._uncle) {
                        initialRotation = -80;
                        saying = self._uncleSay;
                    } else {
                        initialRotation = 80;
                        saying = self._loverSay;
                    }

                    saying.attr({
                        visible: true,
                        opacity: 0,
                        rotation: -80
                    });
                    saying.runAction(new cc.Spawn(
                        new cc.FadeIn(animating),
                        new cc.EaseElasticOut(new cc.RotateTo(animating, 0), .4)
                    ));
                })
            );
            self._mousePullAction = new cc.Sequence(
                new cc.EaseIn(mousePullMoveAction, .8),
                new cc.CallFunc(function () {
                    var animatingTime = .1;
                    var saying;
                    if (self._poppedMouse === self._uncle) {
                        saying = self._uncleSay;
                    } else {
                        saying = self._loverSay;
                    }

                    saying.runAction(new cc.Spawn(
                        new cc.FadeOut(animatingTime),
                        new cc.EaseBackIn(new cc.RotateTo(animatingTime, -40), .4)
                    ));
                })
            );
        },

        _autoPullPoppedMouseProxy: function () {
            this._autoPullPoppedMouse();
        },

        _autoPullPoppedMouse: function () {
            var self = this;
            self._status = self._STATUS.animating;
            self._poppedMouse.runAction(new cc.Sequence(self._mousePullAction, new cc.CallFunc(function () {
                self._status = self._STATUS.idle;
            })));
        }
    };
    namespace.Hole = cc.Sprite.extend(HoleExtended);
})(window.myGame);
