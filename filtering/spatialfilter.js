/**
 * モジュールfilteringはCanvasのフィルタ処理を提供する
 *
 * @module filtering
 */

/**
 * 空間フィルター処理を提供する
 *
 * @class SpatialFilter
 */
jQuery(function($) {

    var spatialFilter = App.namespace('SpatialFilter');

    // SpatialFilter
    (function() {

        var boundary = App.namespace('Boundary');

        /**
         * 空間フィルターのオペレーター
         *
         * @property operator
         * @private
         * @type {Object}
         */
        var operator = {
            smooth: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],           // 平滑化
            mean: [1/16, 2/16, 1/16, 2/16, 4/16, 2/16, 1/16, 2/16, 1/16],    // 平滑化(加重平均)
            sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],                        // 先鋭化
            sharpen2: [-1, -1, -1, -1, 9, -1, -1, -1, -1],                   // 先鋭化2
            differentialH: [0, 0, 0, 0, -1, 1, 0, 0, 0],                     // 横方向一次微分フィルター
            differentialV: [0, 1, 0, 0, -1, 0, 0, 0, 0],                     // 横方向一次微分フィルター
            prewitt: [-1, 0, 1, -1, 0, 1, -1, 0, 1],                         // Prewittフィルター
            sobel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],                            // Sobelフィルター
            emboss: [1, 0, 0, 0, -1, 0, 0, 0, 0]                             // Embossフィルター
        };

        /**
         * 空間フィルター
         *
         * @method spatial
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param imageData
         * @param name filter name
         * @return {Object}
         */
        function spatial(k, imageData, name) {
            if (operator[name] instanceof Array === false) {
                throw new Exception('フィルターがありません。');
            }
            var rgba = {};
            rgba.r = rgba.g = rgba.b = 0;
            var i, j, n, count = 0, index = {};
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    index = boundary.expandedIndex(k, i, j, imageData);
                    n = k + (index.i * 3 + index.j) * 4;
                    rgba.r += parseInt(operator[name][count] * imageData.data[n], 10);
                    rgba.g += parseInt(operator[name][count] * imageData.data[n + 1], 10);
                    rgba.b += parseInt(operator[name][count] * imageData.data[n + 2], 10);
                    count++;
                }
            }
            rgba.a = imageData.data[k + 3]; // alpha
            return rgba;
        }

        /**
         * フィルターの存在を確認
         * @method is
         * @param {String} name filter name
         * @return {Boolean} フィルターがあればtrue、フィルターがないときはfalse
         */
        function is(name) {
            if ($.inArray(name, operator) === false) {
                return false;
            }
            return true;
        }

        /**
         * フィルター処理の呼び出し
         *
         * @method run
         * @param {String} name filter name (mono | grayscale | smooth | mean 加重平均 | sharpen)
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function run(k, imageData, name) {
            return spatial(k , imageData, name);
        }

        spatialFilter.is = is;
        spatialFilter.run = run;

    }());

});
