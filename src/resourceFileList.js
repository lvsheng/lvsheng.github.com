/**
 * @dependence namespace.resourceFileMap
 */
(function (namespace) {
    var resourceFilePathList = [];
    for (var fileName in namespace.resourceFileMap) {
        //noinspection JSUnfilteredForInLoop
        resourceFilePathList.push(namespace.resourceFileMap[fileName]);
    }

    namespace.resourceFileList = resourceFilePathList;
})(window.myGame);
