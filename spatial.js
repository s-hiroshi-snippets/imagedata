jQuery(function($) {

    var processing = {};

    (function() {

        var imageData;

        // コンソール出力
        function print(pixel, i, j) {
            console.log(i + '行' + j + '列');
            console.log('Red : ' + pixel.r);
            console.log('Green : ' + pixel.g);
            console.log('Blue : ' + pixel.b);
            console.log('Alpha : ' + pixel.a);
            console.log('---------------------------------');
        }

        // 境界処理
        function isNotBoundary(k) {
            var length = imageData.width * imageData.height * 4 -1;
            // 上端
            if (k < imageData.width * 4) {
                return false;
            }
            // 右端
            if (((length - k) % imageData.width * 4) === 0) {
                return false;
            }
            // 左端
            if (k % (imageData.width * 4) === 0) {
                return false;
            }
            // 下端
            if (k > length - imageData.width * 4) {
                return false;
            }
            return true;
        }

        // 空間フィルター(3x3)
        function spatial(k) {
            var i, j, n, pixel = {};
            // 境界は走査しない
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    if (isNotBoundary(k) === true) {
                    n = k + (i * 3 + j) * 4;
                    pixel.r = imageData.data[n];      // Red
                    pixel.g =  imageData.data[n + 1]; // Green
                    pixel.b =  imageData.data[n + 2]; // Blue
                    pixel.a = imageData.data[n + 3];  // Alpha
                    print(pixel, i, j);
                    }
                }
            }
        }

        // ピクセルを走査
        function scanPixel() {
            // 全てのピクセルを走査
            var i, j, k, pixel = {};
            // 行
            for (i = 0; i < imageData.height; i++) {
                // 列
                for (j = 0; j < imageData.width; j++) {
                    k  = (i * imageData.width + j) * 4;
                    pixel.r = imageData.data[k];         // Red
                    pixel.g =  imageData.data[k + 1];    // Green
                    pixel.b =  imageData.data[k + 2];     // Blue
                    pixel.a = imageData.data[k + 3];      // Alpha
                    spatial(k);
                }
            }
        }

        // 初期化
        function init(targetImageData) {
            imageData = targetImageData;
        }

        // 公開メソッド
        processing.scanPixel = scanPixel;
        processing.init = init;

    }());

    // 下記カラー情報配列を作成
    // 赤、緑、青
    // シアン、マゼンダ、イエロー
    // 黒、グレー、白
    var data = [
        // 左上(赤)
        255, // Red
        0,   // Green
        0,   // Blue
        255, // Alpha
        // 中上(緑)
        0,
        255,
        0,
        255,
        // 右上(青)
        0,
        0,
        255,
        255,
        // 中左(シアン)
        0,
        255,
        255,
        255,
        // 中中(マゼンダ)
        255,
        0,
        255,
        255,
        // 中右(イエロー)
        255,
        255,
        0,
        255,
        // 下左(黒)
        0,
        0,
        0,
        255,
        // 下中(グレー)
        128,
        128,
        128,
        255,
        // 下右(白)
        255,
        255,
        255,
        255
    ];

    var canvas = $('#canvas1').get(0);
    canvas.width = 3;
    canvas.height = 3;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // ImageDataにピクセル情報設定
    imageData.data.set(data);
    // キャンバスに描画
    ctx.putImageData(imageData, 0, 0);
    processing.init(imageData);
    processing.scanPixel();

});
