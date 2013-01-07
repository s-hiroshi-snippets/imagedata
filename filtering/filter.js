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
         * 反転
         * @method @reverse
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function reverse(k, imageData) {
            var rgba = {};
            rgba.r = 255 - imageData.data[k];
            rgba.g = 255 - imageData.data[k + 1];
            rgba.b = 255 - imageData.data[k + 2];
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

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
         * 赤を増やす
         *
         * @method red
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function red(k, imageData) {
            var rgba = {};
            rgba.r = imageData.data[k];
            rgba.r = (rgba.r < 250) ? rgba.r + 5 : 255;
            rgba.g = imageData.data[k + 1];
            rgba.b = imageData.data[k + 2];
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

        /**
         * グリーンを増やす
         *
         * @method green
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function green(k, imageData) {
            var rgba = {};
            rgba.r = imageData.data[k];
            rgba.g = imageData.data[k + 1];
            rgba.g = (rgba.g < 250) ? rgba.g + 5 : 255;
            rgba.b = imageData.data[k + 2];
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

        /**
         * 青を増やす
         *
         * @method blue
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function blue(k, imageData) {
            var rgba = {};
            rgba.r = imageData.data[k];
            rgba.g = imageData.data[k + 1];
            rgba.b = imageData.data[k + 2];
            rgba.b = (rgba.b < 250) ? rgba.b + 5 : 255;
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
            if ('reverse' === name) {
                return reverse(k, imageData);
            }
            if ('red' === name) {
                return red(k, imageData);
            }
            if ('green' === name) {
                return green(k, imageData);
            }
            if ('blue' === name) {
                return blue(k, imageData);
            }
            // 空間フィルター
            try {
                return spatial(k, imageData, name);
            } catch (e) {
                alert('フィルターがありません。');
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
