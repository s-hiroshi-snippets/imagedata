/**
 * モジュールfilteringはCanvasのフィルタ処理を提供する
 *
 * @module filtering
 */

/**
 * 点フィルター処理を提供する
 * 点フィルターは空間フィルターに対して便宜上点(point)と呼ぶ。
 *
 * @class PointFilter
 */
jQuery(function($) {

    var pointFilter = App.namespace('PointFilter');

    // PointFilter実装
    (function() {


        /**
         * フィルター定義
         *
         * @property filters
         * @private
         * @type Object
         */
        var filters = {}

        /**
         * 反転
         * @method filters.reverse
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        filters.reverse = function(k, imageData) {
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
         * @method filters.mono
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        filters.mono = function(k, imageData) {
            var rgba = {};
            var color = parseInt((imageData.data[k] + imageData.data[k + 1] + imageData.data[k + 2]) / 3, 10);
            color = (color < 128) ? 0 : 255;
            rgba.r = rgba.g = rgba.b = color;
            rgba.a = imageData.data[k + 3];
            return rgba;

        }

        /**
         * グレースケール(NTSC系加重平均法)
         *
         * @method filters.grayscale
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         * @see http://www40.atwiki.jp/spellbound/pages/172.html
         */
         filters.grayscale = function(k, imageData) {
            var rgba = {};
            var average = parseInt(imageData.data[k] * 0.298912 + imageData.data[k + 1] * 0.586611+ imageData.data[k + 2] * 0.114478, 10);
            rgba.r = rgba.g = rgba.b = average;
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

        /**
         * グレースケール(単純平均)
         *
         * @method filters.simpleGrayscale.
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
         filters.simpleGrayscale = function(k, imageData) {
            var rgba = {};
            var average = parseInt((imageData.data[k] + imageData.data[k + 1] + imageData.data[k + 2]) / 3, 10);
            rgba.r = rgba.g = rgba.b = average;
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

        /**
         * sepia セピア調
         *
         * @method filters.sepia.
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         * @see http://www40.atwiki.jp/spellbound/pages/172.html
         */
        filters.sepia = function(k, imageData) {
            var rgba = {};
            // グレースケールへ
            var average = parseInt(imageData.data[k] * 0.298912 + imageData.data[k + 1] * 0.586611+ imageData.data[k + 2] * 0.114478, 10);
            rgba.r = rgba.g = rgba.b = average;
            rgba.a = imageData.data[k + 3];
            // セピアへ
            rgba.r *= 0.9;
            rgba.g *= 0.7;
            rgba.b *= 0.4;
            return rgba;
        }

        /**
         * 赤を増やす
         *
         * @method filters.red
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        filters.red = function(k, imageData) {
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
         * @method filters.green
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        filters.green = function(k, imageData) {
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
         * @method filters.blue
         * @private
         * @param {Number} k 注目ピクセルのRed値に対応するImageData.dataのインデックス<br>
         *     green k + 1<br>
         *     blue  k + 2<br>
         *     alpha k + 3
         * @param {ImageObject} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        filters.blue = function(k, imageData) {
            var rgba = {};
            rgba.r = imageData.data[k];
            rgba.g = imageData.data[k + 1];
            rgba.b = imageData.data[k + 2];
            rgba.b = (rgba.b < 250) ? rgba.b + 5 : 255;
            rgba.a = imageData.data[k + 3];
            return rgba;
        }

        /**
         * フィルターの存在を確認
         * @method is
         * @param {String} name filter name
         * @return {Boolean} フィルターがあればtrue、フィルターがないときはfalse
         */
        function is(name) {
            if (typeof filters[name] !== 'function') {
                return false;
            }
            return true;
        }

        /**
         * フィルター呼び出し処理
         * @method perform
         * @private
         * @param {String} name filter name
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
         * @param {ImageData} imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function perform(k, imageData, name) {
            return filters[name](k, imageData);
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
            return perform(k , imageData, name);
        }

        pointFilter.is = is;
        pointFilter.run = run;

    }());

});
