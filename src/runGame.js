/**
 * @dependence namespace.GameScene
 * @dependence namespace.resourceFileList
 */
(function (namespace) {
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);

        cc.LoaderScene.preload(namespace.resourceFileList, function () {
            cc.director.runScene(new namespace.GameScene());
        }, this);
    };
    cc.game.run("gameCanvas");
})(window.myGame);
