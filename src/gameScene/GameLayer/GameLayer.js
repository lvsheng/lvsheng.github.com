/**
 * @dependence namespace.resourceFileMap
 * @dependence namespace.Hole
 * @dependence namespace.Hammer
 */
(function (namespace) {
    namespace.GameLayer = cc.Layer.extend({
        _POP_MOUSE_INTERVAL_UPDATE_TIME: 5, //每x秒更新一次弹鼠的间隔
        _POP_MOUSE_INTERVAL_LIST: [ //都走完了游戏结束
            1,
            .8,
            .6,
            .5
        ],

        ctor: function () {
            var self = this;
            this._super();

            //初始化成员变量
            self._holes = [];
            self._hammer = null;
            self._popMouseIntervalIndex = 0;

            this.init();
        },
        init: function () {
            var self = this;
            self._super();

            self._initView();
            self._startPop();
            self._listenEvent();
        },

        _initView: function () {
            var self = this;
            var HOLE_POSITIONS = [ //TODO: 改为真正对应图中的点
                cc.p(120, 100),
                cc.p(120, 200),
                cc.p(120, 300),
                cc.p(220, 100),
                cc.p(220, 200),
                cc.p(220, 300),
                cc.p(320, 100),
                cc.p(320, 200),
                cc.p(320, 300)
            ];

            for (var i = 0; i < HOLE_POSITIONS.length; ++i) {
                var createdHole = new namespace.Hole();
                createdHole.x = HOLE_POSITIONS[i].x;
                createdHole.y = HOLE_POSITIONS[i].y;

                self._holes.push(createdHole);
                self.addChild(createdHole);
            }

            //因为洞里的动画不会在花的位置出现，所以就这样让花盖在洞的前面就可以
            var flowersSprite = new cc.Sprite(namespace.resourceFileMap.flowers_png);
            flowersSprite.attr({
                anchorX: 0,
                anchorY: 0,
                x: 0,
                y: 0
            });
            self.addChild(flowersSprite);

            self._hammer = new namespace.Hammer();
            self.addChild(self._hammer);
        },
        _listenEvent: function () {
            var self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch) { self._onUserTouch(touch); }
            }, self);
        },

        _onUserTouch: function (touch) {
            var self = this;
            var pos = touch.getLocation();

            self._hammer.hit(pos.x, pos.y);
            var hittingHole = self._getHoleOn(pos.x, pos.y);
            if (hittingHole) {
                console.log('mouse hitting');
                hittingHole.hitPopOnMouse();
            }
        },

        _getHoleOn: function (x, y) {
            var self = this;
            var resultHole = null;

            for (var i = 0; !resultHole && i < self._holes.length; ++i) {
                var eachHole = self._holes[i];
                if (eachHole.judgeHittingPopOnMouse(x, y)) {
                    resultHole = eachHole;
                }
            }

            return resultHole;
        },

        /**
         * 开始按规则冒地鼠
         * 其实是开始更新的popInterval
         * @private
         */
        _startPop: function () {
            var self = this;

            function updatePopMouseInterval () {
                var newInterval = self._POP_MOUSE_INTERVAL_LIST[self._popMouseIntervalIndex];

                if (newInterval) {
                    self._setPopMouseSchedule(newInterval);
                } else { //游戏结束
                    self.unschedule(updatePopMouseInterval);
                    self.unschedule(self._popMouseProxy);
                    //TODO: 调结束场景？
                }

                ++self._popMouseIntervalIndex;
            }

            //每过self._POP_MOUSE_INTERVAL_UPDATE_TIME更新一次pop的间隔
            self.schedule(updatePopMouseInterval, self._POP_MOUSE_INTERVAL_UPDATE_TIME);
            updatePopMouseInterval();
        },

        _setPopMouseSchedule: function (interval) {
            var self = this;
            self.schedule(self._popMouseProxy, interval);
        },

        _popMouseProxy: function () {
            this._popMouse();
        },

        _popMouse: function () {
            var self = this;

            function hasCanPopHole () {
                var has = false;
                for (var i = 0; i < self._holes.length; ++i) {
                    if (self._holes[i].canPopMouse()) {
                        has = true;
                    }
                }

                return has;
            }


            if (hasCanPopHole()) { //防止都冒出过了，用户还没点时进入死循环
                var popSuccessful = false;
                while (!popSuccessful) { //通过了hasCanPopHole()，所以最终一定能找到
                    var holeIndex = Math.round(Math.random() * (self._holes.length - 1));

                    var selectedHole = self._holes[holeIndex];
                    if (selectedHole.canPopMouse()) {
                        console.log('pop mouse on hole ' + holeIndex);
                        selectedHole.popMouse();
                        popSuccessful = true;
                    }
                }
            }
        }
    });
})(window.myGame);
