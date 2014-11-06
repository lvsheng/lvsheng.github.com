/**
 * @dependence namespace.scoreManager
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    namespace.Hole = cc.Sprite.extend({
        _STATUS: {
            idle: 'idle',
            mouseOn: 'mouseOn',
            animating: 'animating'
        },

        ctor: function () {
            var self = this;
            self._super();

            self._status = self._STATUS.idle;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            self.setTexture(namespace.resourceFileMap.hole_png);
        },

        canPopMouse: function () {
            return this._status === this._STATUS.idle || this._status === this._STATUS.animating;
        },
        hasMouseOn: function () {
            return this._status === this._STATUS.mouseOn;
        },
        popMouse: function () {
            var self = this;

            self._status = self._STATUS.mouseOn;
        },
        hitPopOnMouse: function () {
            var self = this;

            //TODO: 应该先放动画，再放完了加分，动画中改状态，动画完后再改状态
            namespace.scoreManager.hitOneSuccessful();
            self._status = self._STATUS.idle;
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
        }
    });
})(window.myGame);
