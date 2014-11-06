/**
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
        },
        canPopMouse: function () {
            return this._status === this._STATUS.idle || this._status === this._STATUS.animating;
        }
    });
})(window.myGame);
