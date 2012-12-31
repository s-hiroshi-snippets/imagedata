/**
 * @module filtering
 *
 * モジュールcallFilterはCanvasのフィルタ処理を提供する
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

        // 空間フィルター(3x3)の基本例
        function spatial(k, imageData) {
            var i, j, n, index = {}, rgba = {};
            // 境界は走査しない
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    index = boundary.expandedIndex(k, i, j, imageData);
                    n = k + (index.i * 3 + index.j) * 4;
                    rgba.r = imageData.data[n];      // Red
                    rgba.g =  imageData.data[n + 1]; // Green
                    rgba.b =  imageData.data[n + 2]; // Blue
                    rgba.a = imageData.data[n + 3];  // Alpha
                }
            }
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
         * 平滑化
         *
         * 注目ピクセルの近傍(3x3)を使う空間フィルター。
         * @method smooth
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function smooth(k, imageData) {
            var rgba = {};
            var i, j, n, sumRed, sumGreen, sumBlue, index = {};
            sumRed = sumGreen = sumBlue = 0;
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    index = boundary.expandedIndex(k, i, j, imageData);
                    n = k + (index.i * 3 + index.j) * 4;
                    sumRed += imageData.data[n];
                    sumGreen += imageData.data[n + 1];
                    sumBlue += imageData.data[n + 2];
                }
            }
            rgba.r = Math.floor(sumRed / 9);    // R
            rgba.g = Math.floor(sumGreen / 9);  // G
            rgba.b = Math.floor(sumBlue / 9);   // B
            rgba.a = imageData.data[k + 3]; // alpha
            return rgba;
        }

        /**
         * フィルタ呼び出し処理
         * @method process
         * @private
         * @param {String} type フィルタ名
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function callFilter(type, k, imageData) {
            if ('mono' === type) {
                return mono(k, imageData);
            }
            if ('grayscale' === type) {
                return grayscale(k, imageData);
            }
            if ('smooth' === type) {
                return smooth(k, imageData);
            }
        }

        /**
         * フィルタ処理
         *
         * @method run
         * @param {String} type フィルターの種類(mono | grayscale | smooth)
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function run(type, k, imageData) {
            return callFilter(type, k , imageData);
        }

        filter.run = run;

    }());

});
