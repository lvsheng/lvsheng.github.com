/**
 * @dependence namespace.resourceFileMap
 * @dependence namespace.HomeLayer
 */
(function (namespace) {
    namespace.HomeScene = cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new namespace.HomeLayer());
        }
    });
})(window.myGame);
