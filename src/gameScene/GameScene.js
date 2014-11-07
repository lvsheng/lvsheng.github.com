/**
 * @dependence namespace.resourceFileMap
 * @dependence namespace.BackgroundLayer
 * @dependence namespace.GameLayer
 */
(function (namespace) {
    namespace.GameScene = cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new namespace.BackgroundLayer());
            self.addChild(new namespace.GameLayer());
        }
    });
})(window.myGame);
