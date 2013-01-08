/**
 * モジュールfilteringはCanvasのフィルター処理を提供する
 *
 * @module filtering
 */

/**
 * 　画像の全ピクセルを走査しピクセルごとにフィルター処理(Filter.run)を呼び出す
 *
 * @class Scan
 */
jQuery(function($) {

    var scan = App.namespace('Scan');

    // Processing 実装
    (function() {

        var imageData;
        var filter = App.namespace('Filter');

        /**
         * フィルター処理結果のRGBAデータ配列を返すを返す
         *
         * @method run
         * @param {String} name filter name(mono | grayscale | smooth)
         */
        function run(name) {
            // 全ピクセルを走査しピクセルごとにフィルター処理を呼び出す
            var i, j, k, rgba = {}, data = [];
            // 行
            for (i = 0; i < imageData.height; i++) {
                // 列
                for (j = 0; j < imageData.width; j++) {
                    k  = (i * imageData.width + j) * 4;
                    rgba = filter.run(k, imageData, name);
                    data[k] = rgba.r;
                    data[k + 1] = rgba.g;
                    data[k + 2] = rgba.b;
                    data[k + 3] = rgba.a;
                }
            }
            return data;
        }

        /**
         * 初期化
         *
         * 処理対象のImageDataを設定する
         *
         * @method init
         * @param {ImageData} targetImageData
         */
        function init(targetImageData) {
            imageData = targetImageData;
        }

        // 公開メソッド
        scan.run = run;
        scan.init = init;

    }());

});
