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

        var boundary = App.namespace('Boundary');
        /**
         * 空間フィルターのオペレーター
         *
         * @property operator
         * @private
         * @type {Object}
         */
        var operator = {
            smooth: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
            mean: [1/16, 2/16, 1/16, 2/16, 4/16, 2/16, 1/16, 2/16, 1/16],
            sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
            differentialH: [0, 0, 0, 0, -1, 1, 0, 0, 0], // 横方向一次微分フィルター
            differentialV: [0, 1, 0, 0, -1, 0, 0, 0, 0], // 横方向一次微分フィルター
            prewitt: [-1, 0, 1, -1, 0, 1, -1, 0, 1]         // Prewittフィルター
        };

        /**
         * 2値画像フィルター
         *
         * 注目ピクセルの近傍を使わないフィルター。
         *
         * @method mono
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function mono(k, imageData) {
            var rgba = {};
            var color = parseInt((imageData.data[k] + imageData.data[k + 1] + imageData.data[k + 2]) / 3, 10);
            color = (color < 128) ? 0 : 255;
            rgba.r = rgba.g = rgba.b = color;
            rgba.a = imageData.data[k + 3];
            return rgba;

        }

        /**
         * グレースケール
         *
         * 注目ピクセルの近傍を使わないフィルター。
         *
         * @method grayscale
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function grayscale(k, imageData) {
            var rgba = {};
            var color = parseInt((imageData.data[k] + imageData.data[k + 1] + imageData.data[k + 2]) / 3, 10);
            rgba.r = rgba.g = rgba.b = color;
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

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
         * フィルター呼び出し処理
         * @method process
         * @private
         * @param {String} name filter name
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function callFilter(k, imageData, name) {
            if ('mono' === name) {
                return mono(k, imageData);
            }
            if ('grayscale' === name) {
                return grayscale(k, imageData);
            }
            if ('smooth' === name) {
                return spatial(k, imageData, name);
            }
            if ('mean' === name) {
                // 加重平均
                return spatial(k, imageData, name);

            }
            if ('sharpen' === name) {
                return spatial(k, imageData, name);
            }
            if ('differentialH' === name) {
                return spatial(k, imageData, name);
            }
            if ('differentialV' === name) {
                return spatial(k, imageData, name);
            }
            if ('prewitt' === name) {
                return spatial(k, imageData, name);
            }
        }

        /**
         * フィルター処理
         *
         * @method run
         * @param {String} name filter name (mono | grayscale | smooth | mean 加重平均 | sharpen)
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function run(k, imageData, name) {
            return callFilter(k , imageData, name);
        }

        filter.run = run;

    }());

});
