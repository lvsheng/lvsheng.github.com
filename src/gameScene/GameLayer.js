/**
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    namespace.GameLayer = cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();
        },
        init: function () {
            var self = this;
            self._super();
        }
    });
})(window.myGame);
