/**
 * モジュールfilteringはCanvasのフィルタ処理を提供する
 *
 * @module filtering
 */

/**
 * フィルター処理を提供する
 *
 * @class Filter
 */
jQuery(function($) {

    var filter = App.namespace('Filter');

    // Filter実装
    (function() {

        var pointFilter = App.namespace('PointFilter');
        var spatialFilter = App.namespace('SpatialFilter');

        /**
         * フィルター処理
         *
         * @method run
         * @param {String} name filter name
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param imageData
         * @return {Object | Boolean} rgbaの値を格納したオブジェクト。フィルターがないときはfalseを返す。
         */
        function run(k, imageData, name) {
            if (pointFilter.is(name) === true) {
                return pointFilter.run(k, imageData, name);
            }
            if (spatialFilter.is(name) === true) {
                return spatialFilter.run(k , imageData, name);
            }
            return false;
        }

        filter.run = run;

    }());

});
