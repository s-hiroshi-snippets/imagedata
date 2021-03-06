/**
 * モジュールfilteringはCanvasのフィルター処理を提供する
 *
 * @module filtering
 */

/**
 * イベントハンドラ集
 *
 * @class Handle
 */

jQuery(function($) {

    // Handle
    (function() {

        var scan = App.namespace('Scan');

        /**
         * 画像読み込みハンドル
         * images/sample.pngをCanvasへ描画(immediate execution)
         *
         * @method window.load
         * @private
         */
        $(window).load(function() {
            var canvas = document.getElementById('canvas1');
            if (!canvas || !canvas.getContext) { return false; }
            var ctx = canvas.getContext('2d');
            /* Imageオブジェクトを生成 */
            var img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = "images/sample.jpg";
            /* 画像を描画 */
        });

        /**
         * フィルターハンドラ
         *
         * @method button.click
         * @private
         */
        $('button').click(function() {
            var name = $(this).attr('id');
            var canvas = $('#canvas1').get(0);
            var ctx = canvas.getContext('2d');
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            scan.init(imageData);
            imageData.data.set(scan.run(name));
            ctx.putImageData(imageData, 0, 0);
            return false;
        });

    }());

});
