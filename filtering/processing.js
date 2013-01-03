/**
 * モジュールfilteringはCanvasのフィルター処理を提供する
 *
 * @module filtering
 */


/**
 * 各ピクセルごとにフィルター処理を呼び出す
 *
 * @class Processing
 */
jQuery(function($) {

    var processing = App.namespace('Processing');

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
            // 全てのピクセルを走査
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
        processing.run = run;
        processing.init = init;

    }());

});
