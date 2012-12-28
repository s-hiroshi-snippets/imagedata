jQuery(function($) {

    /**
     * @class bundary
     * @type {Object}
     */
    var boundary = {};

    // boundary
    (function() {

        /**
         * 境界処理
         *
         * 左上端のみ実装
         */
        function expandedIndex(k, i, j) {

            var index = {};
            // imageData.dataの添え字の最大値
            var maxIndex = imageData.width * imageData.height * 4 - 1;

            // 左上端
            if (k === 0) {
                if (i === -1 && j === -1) {
                    return {
                        i: -i,
                        j: -j
                    };
                }
                if (i === -1 && j === 0) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === -1 && j === 1) {
                    return {
                        i: -i,
                        j: j
                    };
                }
                if (i === 0 && j === -1) {
                    return {
                        i: i,
                        j: -j
                    };
                }
                // 境界じゃないのでそのまま返す
                return {
                    i: i,
                    j: j
                };
            }
            // 左下端
            if (k === (maxIndex - (imageData.width - 1) * 4)) {
                return {
                    i: 0,
                    j: 0
                };
            }
            // 右上端
            if (k === (imageData.width - 1) * 4) {
                return {
                    i: 0,
                    j: 0
                };
            }
            // 右下端
            if (k === maxIndex) {
                return {
                    i: 0,
                    j: 0
                };
            }
            // 左端
            if (k % (imageData.width * 4) === 0) {
                return {
                    i: 0,
                    j: 0
                };
            }
            // 右端
            if (((maxIndex - k) % imageData.width * 4) === 0) {
                return {
                    i: 0,
                    j: 0
                };
            }
            // 上端
            if (k < imageData.width * 4) {
                return {
                    i: 0,
                    j: 0
                };
            }
            // 下端
            if (k > maxIndex - imageData.width * 4) {
                return {
                    i: 0,
                    j: 0
                };
            }

            // 境界ではないのでインデックス変わらない
            return {
                i: i,
                j: j
            };
        }

        boundary.expandedIndex = expandedIndex;

    }());

    /**
     * @class filter
     * @type {Object}
     */
    var filter = {};

    (function() {

        // 空間フィルター(3x3)
        // テンプレート
        function spatial(k) {
            var i, j, n, index = {}, rgba = {};
            // 境界は走査しない
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    index = boundary.expandedIndex(k, i, j);
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
         * 2値画像
         *
         * @method mono
         * @private
         * @param {Number} k ImageData.dataのred値に対応するインデックス<br>
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
         * @method grayscale
         * @private
         * @param {Number} k ImageData.dataの処理rgbaのred値に対応するインデックス<br>
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
         * @method smooth
         * @private
         * @param {Number} k ImageData.dataの処理pixelのred値に対応するインデックス<br>
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
                    index = boundary.expandedIndex(k, i, j);
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
        function process(type, k, imageData) {
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
         * @param type
         * @param k
         * @param imageData
         * @return {Object} rgbaの値を格納したオブジェクト
         */
        function filtering(type, k, imageData) {
            return process(type, k , imageData);
        }

        filter.filtering = filtering;

    }());

    var processing = {};

    // processing object
    (function() {

        var imageData;

        // コンソール出力
        function print(rgba, i, j) {
            console.log(i + '行' + j + '列');
            console.log('Red : ' + rgba.r);
            console.log('Green : ' + rgba.g);
            console.log('Blue : ' + rgba.b);
            console.log('Alpha : ' + rgba.a);
            console.log('-- -- -- -- --');
        }

        /**
         * フィルタ処理をした配列を返すを返す
         *
         */
        function run(type) {
            // 全てのピクセルを走査
            var i, j, k, rgba = {}, data = [];
            // 行
            for (i = 0; i < imageData.height; i++) {
                // 列
                for (j = 0; j < imageData.width; j++) {
                    k  = (i * imageData.width + j) * 4;
                    rgba = filter.filtering(type, k, imageData);
                    data[k] = rgba.r;
                    data[k + 1] = rgba.g;
                    data[k + 2] = rgba.b;
                    data[k + 3] = rgba.a;
                }
            }
            return data;
        }

        // 初期化
        function init(targetImageData) {
            imageData = targetImageData;
        }

        // 公開メソッド
        processing.run = run;
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
    // ImageDataに初期ピクセル情報設定
    imageData.data.set(data);
    processing.init(imageData);
    console.log(processing.run('smooth'));
    // フィルタ処理後のピクセル情報を設定
    imageData.data.set(processing.run('smooth'));
    ctx.putImageData(imageData, 0, 0);
});
