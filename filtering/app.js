/**
 * モジュールfilteringはCanvasのフィルタ処理を提供する
 *
 * @module filtering
 */

/**
 * 名前空間を設定・管理する。
 *
 * @class App
 */
function App() {}

/**
 * 名前空間の管理
 *
 * <p>引数に対応する既存のオブジェクトが存在するときは
 * そのオブジェクトを返す。存在しないときは空のオブジェクト作成・登録してして返す。</p>
 * @method namespace
 */
App.namespace = function() {
    var objectList = {};
    /**
     *  @param {String} name オブジェクト名
     *  @return {Object} 引数にマップされたオブジェクト
     */
    return function(name) {
        if (typeof objectList[name] === "undefined") {
            objectList[name] = {};
        }
        return objectList[name];
    };
}();
